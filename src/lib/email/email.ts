import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '465'),
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail(options: EmailOptions): Promise<void> {
  const from = process.env.EMAIL_FROM || 'noreply@lms.com';

  try {
    await transporter.sendMail({
      from,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    });
  } catch (error) {
    console.error('Email sending failed:', error);
    throw new Error('Failed to send email');
  }
}

export function getVerificationEmailTemplate(token: string, appUrl: string): string {
  const verifyUrl = `${appUrl}/verify-email?token=${token}`;

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #1a365d;">Verify Your Email</h1>
      <p>Thank you for signing up! Please click the button below to verify your email address.</p>
      <a href="${verifyUrl}" style="display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0;">Verify Email</a>
      <p>Or copy and paste this link:</p>
      <p style="word-break: break-all; color: #4a5568;">${verifyUrl}</p>
      <p style="color: #718096; font-size: 14px;">This link will expire in 24 hours.</p>
    </div>
  `;
}

export function getPasswordResetTemplate(token: string, appUrl: string): string {
  const resetUrl = `${appUrl}/reset-password?token=${token}`;

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #1a365d;">Reset Your Password</h1>
      <p>You requested a password reset. Click the button below to set a new password.</p>
      <a href="${resetUrl}" style="display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0;">Reset Password</a>
      <p>Or copy and paste this link:</p>
      <p style="word-break: break-all; color: #4a5568;">${resetUrl}</p>
      <p style="color: #718096; font-size: 14px;">This link will expire in 1 hour. If you didn't request this, please ignore this email.</p>
    </div>
  `;
}

export function getWelcomeEmailTemplate(name: string, appUrl: string): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #1a365d;">Welcome to LMS Platform!</h1>
      <p>Hi ${name},</p>
      <p>Welcome to LMS Platform! We're excited to have you join our learning community.</p>
      <p>Start exploring courses and begin your learning journey today.</p>
      <a href="${appUrl}/courses" style="display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0;">Browse Courses</a>
      <p style="color: #718096; font-size: 14px;">If you have any questions, feel free to reach out to our support team.</p>
    </div>
  `;
}
