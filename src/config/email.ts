import nodemailer from 'nodemailer';

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
};

export const sendOTPEmail = async (email: string, otp: string): Promise<void> => {
  // Fallback to console logging if SMTP not configured (development mode)
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log('\n📧 EMAIL NOT CONFIGURED - OTP for', email, ':', otp);
    console.log('⏰ OTP expires in', process.env.OTP_EXPIRES_IN, 'minutes\n');
    return;
  }

  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: email,
      subject: 'Your OTP for QR App Verification',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">QR App - OTP Verification</h2>
          <p style="font-size: 16px; color: #555;">Your One-Time Password (OTP) is:</p>
          <div style="background-color: #f4f4f4; padding: 15px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #333; margin: 20px 0;">
            ${otp}
          </div>
          <p style="font-size: 14px; color: #777;">This OTP will expire in ${process.env.OTP_EXPIRES_IN} minutes.</p>
          <p style="font-size: 14px; color: #777;">If you didn't request this OTP, please ignore this email.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ OTP email sent successfully to:', email);
  } catch (error: any) {
    console.error('❌ Failed to send email:', error.message);
    console.log('📧 OTP for', email, ':', otp);
    console.log('⏰ OTP expires in', process.env.OTP_EXPIRES_IN, 'minutes');
    // Continue signup even if email fails (fallback to console OTP)
  }
};
