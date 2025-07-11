const User = require('../models/User');
const { generateToken } = require('../utils/jwtUtils');
const { sendRegistrationOTP, sendPasswordResetOTP } = require('../utils/emailService');
const { asyncHandler } = require('../middleware/errorHandler');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const register = asyncHandler(async (req, res) => {
  const { name, email, password, role = 'user', phone } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(409).json({
      success: false,
      error: {
        code: 'DUPLICATE_001',
        message: 'Email already registered',
        resolution: 'Use a different email or try logging in'
      }
    });
  }

  // Create user with OTP
  const user = new User({
    name,
    email,
    password,
    role,
    phone
  });

  // Generate OTP
  const otp = user.generateOTP();
  await user.save();

  // Send OTP email
  try {
    await sendRegistrationOTP(email, name, otp);
  } catch (error) {
    // If email fails, delete the user and return error
    await User.findByIdAndDelete(user._id);
    console.error('Registration email failed:', error.message);
    return res.status(500).json({
      success: false,
      error: {
        code: 'EMAIL_001',
        message: error.message || 'Failed to send verification email',
        resolution: 'Please check your email configuration or try again later'
      }
    });
  }

  res.status(201).json({
    success: true,
    message: 'Registration successful. Please check your email for verification code.',
    data: {
      email: user.email,
      name: user.name,
      role: user.role
    }
  });
});

// @desc    Verify OTP
// @route   POST /api/auth/verify
// @access  Public
const verifyOTP = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  console.log('OTP Verification Request:', {
    email,
    otpLength: otp?.length,
    otpValue: otp,
    timestamp: new Date().toISOString()
  });

  // Validate input
  if (!email || !otp) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_001',
        message: 'Email and OTP are required',
        resolution: 'Please provide both email and verification code'
      }
    });
  }

  // Find user with OTP fields
  const user = await User.findByEmailForOTP(email);
  
  console.log('User found:', {
    exists: !!user,
    isVerified: user?.isVerified,
    hasOTP: !!user?.otp,
    hasExpiry: !!user?.otpExpiry,
    storedOTP: user?.otp,
    enteredOTP: otp,
    expiryTime: user?.otpExpiry,
    currentTime: new Date(),
    isExpired: user?.otpExpiry < new Date()
  });

  if (!user) {
    return res.status(404).json({
      success: false,
      error: {
        code: 'USER_001',
        message: 'User not found',
        resolution: 'Check your email address'
      }
    });
  }

  if (user.isVerified) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VERIFICATION_001',
        message: 'Account already verified',
        resolution: 'Proceed to login'
      }
    });
  }

  // Verify OTP
  const isValidOTP = user.verifyOTP(otp);
  
  if (!isValidOTP) {
    // Check if OTP is expired
    if (user.otpExpiry && user.otpExpiry < new Date()) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'AUTH_003',
          message: 'Verification code has expired',
          resolution: 'Request a new verification code'
        }
      });
    }
    
    return res.status(400).json({
      success: false,
      error: {
        code: 'AUTH_003',
        message: 'Invalid verification code',
        resolution: 'Check the code and try again, or request a new one'
      }
    });
  }

  // Mark user as verified and clear OTP
  user.isVerified = true;
  user.clearOTP();
  await user.save();

  console.log('User verified successfully:', {
    email: user.email,
    timestamp: new Date().toISOString()
  });

  res.json({
    success: true,
    message: 'Email verified successfully. You can now login.',
    data: {
      email: user.email,
      name: user.name,
      role: user.role
    }
  });
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find user with password
  const user = await User.findByEmailWithPassword(email);
  
  if (!user) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'AUTH_001',
        message: 'Invalid credentials',
        resolution: 'Check your email and password'
      }
    });
  }

  // Check if user is verified
  if (!user.isVerified) {
    return res.status(403).json({
      success: false,
      error: {
        code: 'AUTH_002',
        message: 'Account not verified',
        resolution: 'Complete email verification first'
      }
    });
  }

  // Check if user is active
  if (!user.isActive) {
    return res.status(403).json({
      success: false,
      error: {
        code: 'AUTH_005',
        message: 'Account deactivated',
        resolution: 'Contact administrator'
      }
    });
  }

  // Check password
  const isPasswordValid = await user.matchPassword(password);
  if (!isPasswordValid) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'AUTH_001',
        message: 'Invalid credentials',
        resolution: 'Check your email and password'
      }
    });
  }

  // Update last login
  user.lastLogin = new Date();
  await user.save();

  // Generate token
  const token = generateToken(user._id, user.role);

  res.json({
    success: true,
    message: 'Login successful',
    data: {
      token,
      user: user.profile
    }
  });
});

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findByEmailForOTP(email);
  
  if (!user) {
    // Don't reveal if user exists or not for security
    return res.json({
      success: true,
      message: 'If an account with this email exists, a password reset code has been sent.'
    });
  }

  if (!user.isVerified) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'AUTH_002',
        message: 'Account not verified',
        resolution: 'Complete email verification first'
      }
    });
  }

  // Generate new OTP
  const otp = user.generateOTP();
  await user.save();

  // Send OTP email
  try {
    await sendPasswordResetOTP(email, user.name, otp);
  } catch (error) {
    // Clear OTP if email fails
    user.clearOTP();
    await user.save();
    console.error('Password reset email failed:', error.message);
    return res.status(500).json({
      success: false,
      error: {
        code: 'EMAIL_002',
        message: error.message || 'Failed to send password reset email',
        resolution: 'Please check your email configuration or try again later'
      }
    });
  }

  res.json({
    success: true,
    message: 'Password reset code sent to your email'
  });
});

// @desc    Verify password reset OTP
// @route   POST /api/auth/verify-password-reset-otp
// @access  Public
const verifyPasswordResetOTP = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findByEmailForOTP(email);
  
  if (!user) {
    return res.status(404).json({
      success: false,
      error: {
        code: 'USER_001',
        message: 'User not found',
        resolution: 'Check your email address'
      }
    });
  }

  if (!user.isVerified) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'AUTH_002',
        message: 'Account not verified',
        resolution: 'Complete email verification first'
      }
    });
  }

  // Verify OTP
  if (!user.verifyOTP(otp)) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'AUTH_003',
        message: 'Invalid or expired OTP',
        resolution: 'Request new OTP'
      }
    });
  }

  // Don't clear OTP yet - it will be cleared when password is actually reset
  // Just return success to indicate OTP is valid
  res.json({
    success: true,
    message: 'OTP verified successfully. You can now reset your password.'
  });
});

// @desc    Reset password
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = asyncHandler(async (req, res) => {
  const { email, otp, newPassword } = req.body;

  const user = await User.findByEmailForOTP(email);
  
  if (!user) {
    return res.status(404).json({
      success: false,
      error: {
        code: 'USER_001',
        message: 'User not found',
        resolution: 'Check your email address'
      }
    });
  }

  // Verify OTP
  if (!user.verifyOTP(otp)) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'AUTH_003',
        message: 'Invalid or expired OTP',
        resolution: 'Request new OTP'
      }
    });
  }

  // Update password
  user.password = newPassword;
  user.clearOTP();
  await user.save();

  res.json({
    success: true,
    message: 'Password updated successfully. You can now login with your new password.'
  });
});

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getProfile = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    data: {
      user: req.user.profile
    }
  });
});

// @desc    Update user profile
// @route   PUT /api/auth/me
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  const { name, phone } = req.body;
  const user = req.user;

  // Update fields
  if (name) user.name = name;
  if (phone) user.phone = phone;

  await user.save();

  res.json({
    success: true,
    message: 'Profile updated successfully',
    data: {
      user: user.profile
    }
  });
});

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id).select('+password');

  // Verify current password
  const isPasswordValid = await user.matchPassword(currentPassword);
  if (!isPasswordValid) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'AUTH_001',
        message: 'Current password is incorrect',
        resolution: 'Check your current password'
      }
    });
  }

  // Update password
  user.password = newPassword;
  await user.save();

  res.json({
    success: true,
    message: 'Password changed successfully'
  });
});

// @desc    Resend OTP
// @route   POST /api/auth/resend-otp
// @access  Public
const resendOTP = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findByEmailForOTP(email);
  
  if (!user) {
    return res.status(404).json({
      success: false,
      error: {
        code: 'USER_001',
        message: 'User not found',
        resolution: 'Check your email address'
      }
    });
  }

  if (user.isVerified) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VERIFICATION_001',
        message: 'Account already verified',
        resolution: 'Proceed to login'
      }
    });
  }

  // Generate new OTP
  const otp = user.generateOTP();
  await user.save();

  // Send OTP email
  try {
    await sendRegistrationOTP(email, user.name, otp);
  } catch (error) {
    user.clearOTP();
    await user.save();
    console.error('Resend OTP email failed:', error.message);
    return res.status(500).json({
      success: false,
      error: {
        code: 'EMAIL_003',
        message: error.message || 'Failed to send verification email',
        resolution: 'Please check your email configuration or try again later'
      }
    });
  }

  res.json({
    success: true,
    message: 'New verification code sent to your email'
  });
});

module.exports = {
  register,
  verifyOTP,
  login,
  forgotPassword,
  verifyPasswordResetOTP,
  resetPassword,
  getProfile,
  updateProfile,
  changePassword,
  resendOTP
}; 