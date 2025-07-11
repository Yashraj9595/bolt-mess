const { verifyToken } = require('../utils/jwtUtils');
const User = require('../models/User');

// Authentication middleware
const authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: {
          code: 'AUTH_001',
          message: 'Access token required',
          resolution: 'Include Bearer token in Authorization header'
        }
      });
    }

    const token = authHeader.replace('Bearer ', '');
    
    // Verify token
    const tokenResult = verifyToken(token);
    
    if (!tokenResult.valid) {
      return res.status(401).json({
        error: {
          code: tokenResult.code || 'AUTH_001',
          message: tokenResult.error,
          resolution: tokenResult.code === 'AUTH_004' ? 'Reauthenticate' : 'Check token validity'
        }
      });
    }

    // Find user
    const user = await User.findById(tokenResult.payload.id);
    
    if (!user) {
      return res.status(401).json({
        error: {
          code: 'AUTH_001',
          message: 'User not found',
          resolution: 'Reauthenticate'
        }
      });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        error: {
          code: 'AUTH_002',
          message: 'Account not verified',
          resolution: 'Complete email verification'
        }
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        error: {
          code: 'AUTH_005',
          message: 'Account deactivated',
          resolution: 'Contact administrator'
        }
      });
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication middleware error:', error);
    return res.status(500).json({
      error: {
        code: 'AUTH_001',
        message: 'Authentication failed',
        resolution: 'Try again later'
      }
    });
  }
};

// Role-based authorization middleware
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          error: {
            code: 'AUTH_001',
            message: 'Authentication required',
            resolution: 'Login first'
          }
        });
      }

      if (!roles.includes(req.user.role)) {
        return res.status(403).json({
          error: {
            code: 'AUTH_005',
            message: 'Insufficient permissions',
            resolution: 'Contact administrator for access'
          }
        });
      }

      next();
    } catch (error) {
      console.error('Authorization middleware error:', error);
      return res.status(500).json({
        error: {
          code: 'AUTH_005',
          message: 'Authorization failed',
          resolution: 'Try again later'
        }
      });
    }
  };
};

// Optional authentication (doesn't fail if no token)
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }

    const token = authHeader.replace('Bearer ', '');
    const tokenResult = verifyToken(token);
    
    if (tokenResult.valid) {
      const user = await User.findById(tokenResult.payload.id);
      if (user && user.isVerified && user.isActive) {
        req.user = user;
      }
    }

    next();
  } catch (error) {
    console.error('Optional auth middleware error:', error);
    next();
  }
};

// Admin only middleware
const adminOnly = authorizeRoles('admin');

// Mess owner or admin middleware
const messOwnerOrAdmin = authorizeRoles('mess-owner', 'admin');

// User or higher middleware
const userOrHigher = authorizeRoles('user', 'mess-owner', 'admin');

module.exports = {
  authenticate,
  authorizeRoles,
  optionalAuth,
  adminOnly,
  messOwnerOrAdmin,
  userOrHigher
}; 