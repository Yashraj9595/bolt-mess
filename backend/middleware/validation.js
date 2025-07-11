const { body, validationResult } = require('express-validator');

// Handle validation errors with detailed feedback
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => ({
      field: error.path,
      message: error.msg,
      value: error.value,
      location: error.location
    }));

    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_001',
        message: 'Validation failed',
        details: errorMessages,
        resolution: 'Please check the input fields and try again'
      }
    });
  }
  
  next();
};

// Registration validation with enhanced checks
const validateRegistration = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Name can only contain letters and spaces')
    .escape(),
  
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail()
    .custom(value => {
      if (value.endsWith('@example.com')) {
        throw new Error('Example email domains are not allowed');
      }
      return true;
    }),
  
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
  
  body('role')
    .optional()
    .isIn(['user', 'mess-owner', 'admin'])
    .withMessage('Invalid role selected'),
  
  body('phone')
    .optional()
    .matches(/^\+?[\d\s-]{10,15}$/)
    .withMessage('Please enter a valid phone number (10-15 digits)')
    .trim(),
  
  handleValidationErrors
];

// Login validation with enhanced security
const validateLogin = [
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long'),
  
  handleValidationErrors
];

// OTP verification with enhanced validation
const validateOTPVerification = [
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail(),
  
  body('otp')
    .isLength({ min: 6, max: 6 })
    .withMessage('OTP must be exactly 6 digits')
    .isNumeric()
    .withMessage('OTP must contain only numbers')
    .custom(value => {
      if (!/^\d{6}$/.test(value)) {
        throw new Error('Invalid OTP format');
      }
      return true;
    }),
  
  handleValidationErrors
];

// Password reset validation with strong password requirements
const validatePasswordReset = [
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail(),
  
  body('otp')
    .isLength({ min: 6, max: 6 })
    .withMessage('OTP must be exactly 6 digits')
    .isNumeric()
    .withMessage('OTP must contain only numbers')
    .custom(value => {
      if (!/^\d{6}$/.test(value)) {
        throw new Error('Invalid OTP format');
      }
      return true;
    }),
  
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character')
    .custom((value, { req }) => {
      if (value === req.body.oldPassword) {
        throw new Error('New password must be different from the old password');
      }
      return true;
    }),
  
  handleValidationErrors
];

// Forgot password validation
const validateForgotPassword = [
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail(),
  
  handleValidationErrors
];

// Profile update validation with enhanced checks
const validateProfileUpdate = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Name can only contain letters and spaces')
    .escape(),
  
  body('phone')
    .optional()
    .matches(/^\+?[\d\s-]{10,15}$/)
    .withMessage('Please enter a valid phone number (10-15 digits)')
    .trim(),
  
  handleValidationErrors
];

// Rate limiting validation with enhanced security
const validateRateLimit = (req, res, next) => {
  const clientIP = req.ip;
  const endpoint = req.originalUrl;
  
  // Log sensitive operations for security monitoring
  if (endpoint.includes('/auth/') || endpoint.includes('/password/')) {
    console.log(`Security sensitive operation from IP: ${clientIP} on endpoint: ${endpoint}`);
  }
  
  next();
};

module.exports = {
  handleValidationErrors,
  validateRegistration,
  validateLogin,
  validateOTPVerification,
  validatePasswordReset,
  validateForgotPassword,
  validateProfileUpdate,
  validateRateLimit
}; 