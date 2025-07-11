// Global error handling middleware
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error for debugging
  console.error('Error:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = {
      code: 'RESOURCE_001',
      message,
      resolution: 'Check the resource ID'
    };
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `${field} already exists`;
    error = {
      code: 'DUPLICATE_001',
      message,
      resolution: `Choose a different ${field}`
    };
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = {
      code: 'VALIDATION_001',
      message: 'Validation failed',
      details: Object.values(err.errors).map(val => ({
        field: val.path,
        message: val.message,
        value: val.value
      })),
      resolution: 'Check input fields and try again'
    };
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error = {
      code: 'AUTH_001',
      message: 'Invalid token',
      resolution: 'Reauthenticate'
    };
  }

  if (err.name === 'TokenExpiredError') {
    error = {
      code: 'AUTH_004',
      message: 'Token expired',
      resolution: 'Reauthenticate'
    };
  }

  // Email sending errors
  if (err.message === 'Failed to send email') {
    error = {
      code: 'EMAIL_001',
      message: 'Failed to send email',
      resolution: 'Try again later or contact support'
    };
  }

  // Database connection errors
  if (err.name === 'MongoNetworkError') {
    error = {
      code: 'DB_001',
      message: 'Database connection failed',
      resolution: 'Try again later'
    };
  }

  // Default error
  if (!error.code) {
    error = {
      code: 'INTERNAL_001',
      message: 'Internal server error',
      resolution: 'Try again later'
    };
  }

  // Set status code
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  // Send error response
  res.status(statusCode).json({
    success: false,
    error: {
      code: error.code,
      message: error.message,
      resolution: error.resolution,
      ...(error.details && { details: error.details }),
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    },
    timestamp: new Date().toISOString(),
    path: req.url,
    method: req.method
  });
};

// 404 handler
const notFound = (req, res, next) => {
  const error = new Error(`Not found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Async error wrapper
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = {
  errorHandler,
  notFound,
  asyncHandler
}; 