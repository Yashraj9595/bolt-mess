const nodemailer = require('nodemailer');

// Create transporter with Gmail configuration
const createTransporter = () => {
  // In development mode with SKIP_EMAIL=true, use a mock transporter
  if (process.env.NODE_ENV !== 'production' && process.env.SKIP_EMAIL === 'true') {
    console.log('📧 Using mock email transporter in development mode');
    return {
      verify: () => Promise.resolve(true),
      sendMail: (options) => {
        console.log('📧 MOCK EMAIL SENT:');
        console.log('   To:', options.to);
        console.log('   Subject:', options.subject);
        console.log('   Content:', options.text || 'HTML Content');
        if (options.html && options.html.includes('Verification Code')) {
          // Extract OTP from HTML content for easier testing
          const otpMatch = options.html.match(/(\d{6})<\/h3>/);
          if (otpMatch && otpMatch[1]) {
            console.log('   🔑 OTP CODE:', otpMatch[1]);
          }
        }
        return Promise.resolve({ messageId: 'mock-email-id-' + Date.now() });
      }
    };
  }

  // Use the correct environment variables (either EMAIL_* or GMAIL_*)
  const emailUser = process.env.EMAIL_USER || process.env.GMAIL_USER;
  const emailPass = process.env.EMAIL_PASS || process.env.GMAIL_APP_PASSWORD;
  const emailHost = process.env.EMAIL_HOST || 'smtp.gmail.com';
  const emailPort = parseInt(process.env.EMAIL_PORT || '587');

  const config = {
    host: emailHost,
    port: emailPort,
    secure: emailPort === 465,
    auth: {
      user: emailUser,
      pass: emailPass,
    },
    // Better error handling and connection settings
    connectionTimeout: 60000, // 60 seconds
    greetingTimeout: 30000,   // 30 seconds
    socketTimeout: 60000,     // 60 seconds
    tls: {
      rejectUnauthorized: false // For development
    }
  };

  console.log('Email configuration:', {
    host: config.host,
    port: config.port,
    secure: config.secure,
    user: config.auth.user,
    pass: config.auth.pass ? '********' : 'not set'
  });

  return nodemailer.createTransport(config);
};

// Test email connection
const testEmailConnection = async () => {
  try {
    // Skip real connection test in development mode
    if (process.env.NODE_ENV !== 'production' && process.env.SKIP_EMAIL === 'true') {
      console.log('✅ Mock email server ready (SKIP_EMAIL=true)');
      return true;
    }

    const transporter = createTransporter();
    await transporter.verify();
    console.log('✅ Email server connection successful');
    return true;
  } catch (error) {
    console.error('❌ Email server connection failed:', error.message);
    return false;
  }
};

// Email templates
const emailTemplates = {
  registrationOTP: (name, otp) => ({
    subject: 'Verify Your Email - Mess App Registration',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">Mess App</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Email Verification</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #333; margin-bottom: 20px;">Hello ${name}!</h2>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">
            Thank you for registering with Mess App. To complete your registration, please use the following verification code:
          </p>
          
          <div style="background: #fff; border: 2px dashed #667eea; border-radius: 8px; padding: 20px; text-align: center; margin: 25px 0;">
            <h3 style="color: #667eea; margin: 0; font-size: 32px; letter-spacing: 5px;">${otp}</h3>
            <p style="color: #999; margin: 10px 0 0 0; font-size: 14px;">Verification Code</p>
          </div>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            This code will expire in ${process.env.OTP_EXPIRY_MINUTES || 10} minutes. If you didn't request this verification, please ignore this email.
          </p>
          
          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #999; font-size: 12px;">
              Best regards,<br>
              The Mess App Team
            </p>
          </div>
        </div>
      </div>
    `
  }),
  
  passwordResetOTP: (name, otp) => ({
    subject: 'Password Reset - Mess App',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">Mess App</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Password Reset</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #333; margin-bottom: 20px;">Hello ${name}!</h2>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">
            We received a request to reset your password. Use the following verification code to complete the process:
          </p>
          
          <div style="background: #fff; border: 2px dashed #ff6b6b; border-radius: 8px; padding: 20px; text-align: center; margin: 25px 0;">
            <h3 style="color: #ff6b6b; margin: 0; font-size: 32px; letter-spacing: 5px;">${otp}</h3>
            <p style="color: #999; margin: 10px 0 0 0; font-size: 14px;">Reset Code</p>
          </div>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            This code will expire in ${process.env.OTP_EXPIRY_MINUTES || 10} minutes. If you didn't request a password reset, please ignore this email and your password will remain unchanged.
          </p>
          
          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #999; font-size: 12px;">
              Best regards,<br>
              The Mess App Team
            </p>
          </div>
        </div>
      </div>
    `
  })
};

// Send email function with enhanced error handling and retry mechanism
const sendEmail = async (to, template, data) => {
  const maxRetries = 3;
  let attempt = 0;

  // Get the email user from environment variables
  const emailUser = process.env.EMAIL_USER || process.env.GMAIL_USER;

  // Development mode: bypass email sending for testing
  if (process.env.NODE_ENV !== 'production' && process.env.SKIP_EMAIL === 'true') {
    console.log(`🚀 DEVELOPMENT MODE: Using mock email`);
    console.log(`📧 Would send ${template} email to: ${to}`);
    console.log(`🔢 OTP Code: ${data.otp}`);
    return { success: true, messageId: 'dev-mode-skip-' + Date.now() };
  }

  while (attempt < maxRetries) {
    try {
      console.log(`📧 Attempting to send ${template} email to: ${to} (Attempt ${attempt + 1}/${maxRetries})`);
      
      const transporter = createTransporter();
      const emailContent = emailTemplates[template](data.name, data.otp);
      
      // Validate email format
      if (!to.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        throw new Error('Invalid email format');
      }

      const mailOptions = {
        from: {
          name: 'Mess App',
          address: emailUser
        },
        to: to,
        subject: emailContent.subject,
        html: emailContent.html,
        headers: {
          'X-Priority': '1',
          'X-MSMail-Priority': 'High',
          'Importance': 'high'
        }
      };

      console.log('📤 Sending email...');
      const info = await transporter.sendMail(mailOptions);
      console.log('✅ Email sent successfully:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error(`❌ Email sending failed (Attempt ${attempt + 1}/${maxRetries}):`, {
        error: error.message,
        code: error.code,
        command: error.command,
        responseCode: error.responseCode,
        response: error.response
      });
      
      attempt++;
      
      // If this was the last attempt, throw the error
      if (attempt === maxRetries) {
        let errorMessage = 'Failed to send email after multiple attempts';
        if (error.code === 'EAUTH') {
          errorMessage = 'Email authentication failed. Please check your email credentials.';
        } else if (error.code === 'ECONNECTION') {
          errorMessage = 'Unable to connect to email server. Please check your email configuration.';
        } else if (error.code === 'ETIMEDOUT') {
          errorMessage = 'Email server connection timed out. Please try again.';
        } else if (error.code === 'EDNS') {
          errorMessage = 'Email server not found. Please check your EMAIL_HOST configuration.';
        }
        
        throw new Error(errorMessage);
      }
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }
  }
};

// Send registration OTP
const sendRegistrationOTP = async (email, name, otp) => {
  return await sendEmail(email, 'registrationOTP', { name, otp });
};

// Send password reset OTP
const sendPasswordResetOTP = async (email, name, otp) => {
  return await sendEmail(email, 'passwordResetOTP', { name, otp });
};

module.exports = {
  sendRegistrationOTP,
  sendPasswordResetOTP,
  sendEmail,
  testEmailConnection
}; 