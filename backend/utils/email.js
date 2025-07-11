const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// Send OTP email function
const sendOTPEmail = async (email, otp, name, type = 'verification') => {
  try {
    // Skip email sending in development if SKIP_EMAIL is true
    if (process.env.SKIP_EMAIL === 'true' && process.env.NODE_ENV === 'development') {
      console.log(`[DEV MODE] Skipping email send. OTP for ${email}: ${otp}`);
      return true;
    }

    const transporter = createTransporter();

    let subject, htmlContent;

    if (type === 'reset') {
      subject = 'Password Reset Code - MessHub';
      htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #145374;">Password Reset Request</h2>
          <p>Hello ${name},</p>
          <p>You requested to reset your password for your MessHub account. Use the verification code below:</p>
          <div style="background-color: #f8f9fa; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;">
            <h1 style="color: #145374; font-size: 32px; margin: 0; letter-spacing: 4px;">${otp}</h1>
          </div>
          <p>This code will expire in 10 minutes for security reasons.</p>
          <p>If you didn't request this password reset, please ignore this email.</p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 12px;">
            This is an automated message from MessHub. Please do not reply to this email.
          </p>
        </div>
      `;
    } else {
      subject = 'Verify Your Account - MessHub';
      htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #145374;">Welcome to MessHub!</h2>
          <p>Hello ${name},</p>
          <p>Thank you for registering with MessHub. Please verify your email address using the code below:</p>
          <div style="background-color: #f8f9fa; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;">
            <h1 style="color: #145374; font-size: 32px; margin: 0; letter-spacing: 4px;">${otp}</h1>
          </div>
          <p>This code will expire in 10 minutes for security reasons.</p>
          <p>If you didn't create this account, please ignore this email.</p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 12px;">
            This is an automated message from MessHub. Please do not reply to this email.
          </p>
        </div>
      `;
    }

    const mailOptions = {
      from: `"MessHub" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: subject,
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return true;

  } catch (error) {
    console.error('Email sending failed:', error);
    throw new Error('Failed to send email');
  }
};

module.exports = {
  sendOTPEmail,
};