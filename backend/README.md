# Mess App Backend - Authentication System

A secure, scalable backend authentication system built with Node.js, Express, and MongoDB. Features comprehensive user authentication with OTP verification, role-based access control, and mobile-optimized API responses.

## 🚀 Features

- **User Registration** with email OTP verification
- **Secure Login** with JWT authentication
- **Password Reset** via email OTP
- **Role-Based Access Control** (User, Mess-Owner, Admin)
- **Mobile-Optimized** API responses
- **Rate Limiting** for security
- **Comprehensive Error Handling**
- **Email Service** with beautiful templates
- **Input Validation** and sanitization

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud)
- Gmail account for email service

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   
   # MongoDB Configuration
   MONGODB_URI=mongodb://localhost:27017/mess-app
   
   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRES_IN=24h
   
   # Email Configuration (Gmail)
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   
   # OTP Configuration
   OTP_EXPIRY_MINUTES=10
   
   # Rate Limiting
   RATE_LIMIT_WINDOW_MS=60000
   RATE_LIMIT_MAX_REQUESTS=5
   
   # Frontend URL for CORS
   FRONTEND_URL=http://localhost:3000
   ```

4. **Start the server**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## 📧 Email Setup

### Gmail Configuration
1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
3. Use the generated password in `EMAIL_PASS`

## 🔌 API Endpoints

### Authentication Endpoints

#### 1. Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "role": "user",
  "phone": "+1234567890"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Registration successful. Please check your email for verification code.",
  "data": {
    "email": "john@example.com",
    "name": "John Doe",
    "role": "user"
  }
}
```

#### 2. Verify OTP
```http
POST /api/auth/verify
Content-Type: application/json

{
  "email": "john@example.com",
  "otp": "123456"
}
```

#### 3. Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "60f7b3b3b3b3b3b3b3b3b3b3",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "isVerified": true,
      "phone": "+1234567890",
      "profilePicture": null,
      "lastLogin": "2024-01-15T10:30:00.000Z",
      "createdAt": "2024-01-15T10:00:00.000Z"
    }
  }
}
```

#### 4. Forgot Password
```http
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "john@example.com"
}
```

#### 5. Reset Password
```http
POST /api/auth/reset-password
Content-Type: application/json

{
  "email": "john@example.com",
  "otp": "123456",
  "newPassword": "NewSecurePass123"
}
```

#### 6. Get Profile (Protected)
```http
GET /api/auth/me
Authorization: Bearer <token>
```

#### 7. Update Profile (Protected)
```http
PUT /api/auth/me
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Smith",
  "phone": "+1987654321"
}
```

#### 8. Change Password (Protected)
```http
PUT /api/auth/change-password
Authorization: Bearer <token>
Content-Type: application/json

{
  "currentPassword": "SecurePass123",
  "newPassword": "NewSecurePass123"
}
```

#### 9. Resend OTP
```http
POST /api/auth/resend-otp
Content-Type: application/json

{
  "email": "john@example.com"
}
```

## 🔐 Role-Based Access Control

### Available Roles
- **user**: Basic user access
- **mess-owner**: Mess management access
- **admin**: Full system access

### Using Authorization Middleware
```javascript
const { authenticate, authorizeRoles } = require('./middleware/auth');

// Admin only route
app.get('/admin/dashboard', authenticate, authorizeRoles('admin'), adminController);

// Mess owner or admin route
app.get('/mess/manage', authenticate, authorizeRoles('mess-owner', 'admin'), messController);

// User or higher route
app.get('/profile', authenticate, authorizeRoles('user', 'mess-owner', 'admin'), profileController);
```

## 🛡️ Security Features

### Rate Limiting
- **Sensitive endpoints**: 5 requests per minute
- **Authentication**: 10 requests per 15 minutes

### Password Requirements
- Minimum 6 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number

### JWT Security
- 24-hour expiration
- Secure token generation
- Role-based payload

### Input Validation
- Email format validation
- Phone number validation
- Name format validation
- OTP format validation

## 📱 Mobile Optimization

### Response Headers
```http
Access-Control-Allow-Origin: http://localhost:3000
Content-Type: application/json; charset=utf-8
Cache-Control: no-store
```

### Error Response Format
```json
{
  "success": false,
  "error": {
    "code": "AUTH_001",
    "message": "Invalid credentials",
    "resolution": "Check your email and password"
  },
  "timestamp": "2024-01-15T10:30:00.000Z",
  "path": "/api/auth/login",
  "method": "POST"
}
```

## 🗄️ Database Schema

### User Model
```javascript
{
  name: String (required, 2-50 chars),
  email: String (required, unique, validated),
  password: String (required, hashed, min 6 chars),
  role: String (enum: ['user', 'mess-owner', 'admin']),
  isVerified: Boolean (default: false),
  otp: String (6 digits, select: false),
  otpExpiry: Date (10 minutes, select: false),
  phone: String (optional, validated),
  profilePicture: String (optional),
  lastLogin: Date,
  isActive: Boolean (default: true),
  timestamps: true
}
```

## 🧪 Testing

### Health Check
```bash
curl http://localhost:5000/health
```

### Test Registration
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "TestPass123"
  }'
```

## 📊 Error Codes

| Code | Meaning | Resolution |
|------|---------|------------|
| AUTH_001 | Invalid credentials/token | Check credentials or reauthenticate |
| AUTH_002 | Account not verified | Complete email verification |
| AUTH_003 | Invalid/expired OTP | Request new OTP |
| AUTH_004 | Token expired | Reauthenticate |
| AUTH_005 | Unauthorized role | Contact administrator |
| VALIDATION_001 | Validation failed | Check input fields |
| DUPLICATE_001 | Email already exists | Use different email |
| RATE_LIMIT_001 | Too many requests | Wait and try again |
| EMAIL_001 | Email sending failed | Try again later |

## 🚀 Deployment

### Environment Variables for Production
```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mess-app
JWT_SECRET=very-long-secure-secret-key
EMAIL_HOST=smtp.gmail.com
EMAIL_USER=your-production-email@gmail.com
EMAIL_PASS=your-production-app-password
FRONTEND_URL=https://your-frontend-domain.com
```

### PM2 Deployment
```bash
npm install -g pm2
pm2 start server.js --name "mess-app-backend"
pm2 save
pm2 startup
```

## 📝 License

MIT License - see LICENSE file for details

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📞 Support

For support and questions, please contact the development team. 