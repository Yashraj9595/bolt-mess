require('dotenv').config();
const nodemailer = require('nodemailer');

// Test email function
async function testEmail() {
  console.log('🧪 Testing email configuration...');
  
  // Log environment variables (without showing password)
  console.log('📧 Email configuration:', {
    EMAIL_HOST: process.env.EMAIL_HOST,
    EMAIL_PORT: process.env.EMAIL_PORT,
    EMAIL_USER: process.env.EMAIL_USER,
    EMAIL_PASS: process.env.EMAIL_PASS ? '********' : 'not set',
    OTP_EXPIRY_MINUTES: process.env.OTP_EXPIRY_MINUTES
  });

  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT),
      secure: parseInt(process.env.EMAIL_PORT) === 465,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false // For development
      }
    });

    // Verify connection
    console.log('🔄 Verifying connection to email server...');
    await transporter.verify();
    console.log('✅ Email server connection successful');

    // Send test email
    console.log('📤 Sending test email...');
    const info = await transporter.sendMail({
      from: {
        name: 'Mess App',
        address: process.env.EMAIL_USER
      },
      to: 'yashrajjagtap95@gmail.com', // Change this to your email
      subject: 'Test Email from Mess App',
      text: 'This is a test email to verify the email configuration.',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px;">
          <h2>Email Test</h2>
          <p>This is a test email to verify that your email configuration is working correctly.</p>
          <p>Test OTP: <strong>123456</strong></p>
          <p>If you received this email, your email service is configured correctly.</p>
          <p>Time sent: ${new Date().toISOString()}</p>
        </div>
      `,
      headers: {
        'X-Priority': '1',
        'X-MSMail-Priority': 'High',
        'Importance': 'high'
      }
    });

    console.log('✅ Test email sent successfully:', info.messageId);
    console.log('📬 Check your inbox at yashrajjagtap95@gmail.com');
    
  } catch (error) {
    console.error('❌ Email test failed:', error);
    
    // Provide more specific error information
    if (error.code === 'EAUTH') {
      console.error('🔑 Authentication failed. Check your email username and password.');
      console.error('💡 If using Gmail, make sure you have:');
      console.error('   1. Enabled "Less secure app access" or');
      console.error('   2. Set up 2FA and created an app password');
    } else if (error.code === 'ESOCKET') {
      console.error('🔌 Socket connection error. Check your EMAIL_HOST and EMAIL_PORT settings.');
    } else if (error.code === 'ETIMEDOUT') {
      console.error('⏱️ Connection timed out. Check your network and firewall settings.');
    }
  }
}

// Run the test
testEmail(); 