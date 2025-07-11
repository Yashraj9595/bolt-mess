// Add mongoose import at the top
const mongoose = require('mongoose');

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const { errorHandler, notFound } = require('./middleware/errorHandler');
const { testEmailConnection } = require('./utils/emailService');

// Import routes
const authRoutes = require('./routes/authRoutes');

// Validate required environment variables
const requiredEnvVars = {
  MONGODB_URI: process.env.MONGODB_URI,
  JWT_SECRET: process.env.JWT_SECRET
};

// Map the email variables to the correct environment variable names
process.env.GMAIL_USER = process.env.EMAIL_USER || process.env.GMAIL_USER;
process.env.GMAIL_APP_PASSWORD = process.env.EMAIL_PASS || process.env.GMAIL_APP_PASSWORD;

// Email variables are required in production but optional in development
if (process.env.NODE_ENV === 'production') {
  requiredEnvVars.EMAIL_USER = process.env.EMAIL_USER || process.env.GMAIL_USER;
  requiredEnvVars.EMAIL_PASS = process.env.EMAIL_PASS || process.env.GMAIL_APP_PASSWORD;
} else {
  // In development, use dummy values if not provided
  if (!process.env.EMAIL_USER && !process.env.GMAIL_USER) {
    process.env.GMAIL_USER = 'dev@example.com';
  }
  if (!process.env.EMAIL_PASS && !process.env.GMAIL_APP_PASSWORD) {
    process.env.GMAIL_APP_PASSWORD = 'dummy_password';
  }
  process.env.SKIP_EMAIL = process.env.SKIP_EMAIL || 'false'; // Set to false to use real email
}

// Check for missing environment variables
const missingVars = Object.entries(requiredEnvVars)
  .filter(([key, value]) => !value)
  .map(([key]) => key);

if (missingVars.length > 0) {
  console.error('❌ Missing required environment variables:', missingVars.join(', '));
  process.exit(1);
}

// Log configuration (without sensitive data)
console.log('📦 Environment Configuration:', {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  EMAIL_USER: process.env.GMAIL_USER,
  MONGODB_URI: process.env.MONGODB_URI?.split('@')[1] || 'local', // Only show host part
  OTP_EXPIRY_MINUTES: process.env.OTP_EXPIRY_MINUTES
});

// Initialize express
const app = express();

// Connect to database
connectDB();

// Global rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    error: {
      code: 'RATE_LIMIT_003',
      message: 'Too many requests from this IP',
      resolution: 'Please try again later'
    }
  }
});

// Apply rate limiter to all requests
app.use(limiter);

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", process.env.FRONTEND_URL || 'http://localhost:3000'],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

// Enhanced CORS configuration
app.use(cors({
  origin: ['http://localhost:8080', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
}));

// Handle preflight requests
app.options('*', cors());

// Compression middleware
app.use(compression());

// Body parsing middleware with size limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url} - ${req.ip}`);
  next();
});

// Test email connection on startup
testEmailConnection()
  .then(isConnected => {
    if (!isConnected) {
      console.error('❌ Email service not properly configured');
    }
  })
  .catch(error => {
    console.error('❌ Email connection test failed:', error.message);
  });

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version || '1.0.0'
  });
});

// API routes
app.use('/api/auth', authRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Mess App API',
    version: process.env.npm_package_version || '1.0.0',
    endpoints: {
      auth: '/api/auth',
      health: '/health'
    },
    documentation: process.env.API_DOCS_URL || 'API documentation coming soon'
  });
});

// 404 handler
app.use(notFound);

// Error handler (must be last)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`
🚀 Server running on port ${PORT}
📧 Email service: ${process.env.EMAIL_HOST || 'Not configured'}
🗄️  Database: ${process.env.MONGODB_URI ? 'Connected' : 'Not configured'}
🌍 Environment: ${process.env.NODE_ENV || 'development'}
🔒 Security: Enabled (Helmet + CORS)
⚡ Compression: Enabled
  `);
});

// Graceful shutdown
const gracefulShutdown = () => {
  console.log('🔄 Received shutdown signal. Closing server gracefully...');
  server.close(() => {
    console.log('👋 Server closed. Disconnecting from database...');
    mongoose.connection.close(false, () => {
      console.log('📦 Database connection closed.');
      process.exit(0);
    });
  });

  // Force close after 30 seconds
  setTimeout(() => {
    console.error('⚠️ Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 30000);
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// Unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error('❌ Unhandled Promise Rejection:', err);
  process.exit(1);
});

// Uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  process.exit(1);
});

module.exports = server; 