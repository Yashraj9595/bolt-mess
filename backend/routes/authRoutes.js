const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();

// Import controllers
const {
  register,
  verifyOTP,
  verifyPasswordResetOTP,
  login,
  forgotPassword,
  resetPassword,
  getProfile,
  updateProfile,
  changePassword,
  resendOTP
} = require('../controllers/authController');

// Import middleware
const {
  authenticate,
  validateRegistration,
  validateLogin,
  validateOTPVerification,
  validatePasswordReset,
  validateForgotPassword,
  validateProfileUpdate
} = require('../middleware/validation');

const { authenticate: authMiddleware } = require('../middleware/auth');

// Rate limiting for sensitive endpoints
const sensitiveLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 60000, // 1 minute
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 5, // 5 requests per window
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_001',
      message: 'Too many requests',
      resolution: 'Try again in a few minutes'
    }
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 requests per window
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_002',
      message: 'Too many authentication attempts',
      resolution: 'Try again in 15 minutes'
    }
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Public routes
router.post('/register', sensitiveLimiter, validateRegistration, register);
router.post('/verify', sensitiveLimiter, validateOTPVerification, verifyOTP);
router.post('/verify-password-reset-otp', sensitiveLimiter, validateOTPVerification, verifyPasswordResetOTP);
router.post('/login', authLimiter, validateLogin, login);
router.post('/forgot-password', sensitiveLimiter, validateForgotPassword, forgotPassword);
router.post('/reset-password', sensitiveLimiter, validatePasswordReset, resetPassword);
router.post('/resend-otp', sensitiveLimiter, validateForgotPassword, resendOTP);

// Protected routes
router.get('/me', authMiddleware, getProfile);
router.put('/me', authMiddleware, validateProfileUpdate, updateProfile);
router.put('/change-password', authMiddleware, validatePasswordReset, changePassword);

module.exports = router; 