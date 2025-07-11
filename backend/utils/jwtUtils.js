const jwt = require('jsonwebtoken');

// Generate JWT token
const generateToken = (userId, role) => {
  try {
    const payload = {
      id: userId,
      role: role
    };

    return jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '24h'
    });
  } catch (error) {
    console.error('Token generation error:', error);
    throw new Error('Failed to generate token');
  }
};

// Verify JWT token
const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return {
      valid: true,
      payload: decoded
    };
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return {
        valid: false,
        error: 'Token expired',
        code: 'AUTH_004'
      };
    } else if (error.name === 'JsonWebTokenError') {
      return {
        valid: false,
        error: 'Invalid token',
        code: 'AUTH_001'
      };
    } else {
      return {
        valid: false,
        error: 'Token verification failed',
        code: 'AUTH_001'
      };
    }
  }
};

// Decode token without verification (for debugging)
const decodeToken = (token) => {
  try {
    return jwt.decode(token);
  } catch (error) {
    console.error('Token decode error:', error);
    return null;
  }
};

// Generate refresh token (for future use)
const generateRefreshToken = (userId) => {
  try {
    return jwt.sign(
      { id: userId, type: 'refresh' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
  } catch (error) {
    console.error('Refresh token generation error:', error);
    throw new Error('Failed to generate refresh token');
  }
};

module.exports = {
  generateToken,
  verifyToken,
  decodeToken,
  generateRefreshToken
}; 