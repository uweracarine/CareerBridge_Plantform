import nodemailer from 'nodemailer';
import { config } from '../config/env.js';

const createTransporter = () => {
  return nodemailer.createTransport({
    host: config.SMTP_HOST,
    port: config.SMTP_PORT,
    secure: config.SMTP_PORT === 465,
    auth: {
      user: config.SMTP_USER,
      pass: config.SMTP_PASS,
    },
  });
};

const sendMail = async ({ to, subject, html }) => {
  if (!config.ENABLE_EMAIL) {
    console.log(`[Email disabled] To: ${to} | Subject: ${subject}`);
    return { messageId: 'email-disabled' };
  }
  const transporter = createTransporter();
  return transporter.sendMail({ from: config.MAIL_FROM, to, subject, html });
};

export const sendVerificationEmail = async (email, fullName, token) => {
  const url = `${config.FRONTEND_URL}/verify-email?token=${token}`;
  await sendMail({
    to: email,
    subject: 'Verify your CareerBridge account',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
        <div style="background:#142B4A;padding:24px;text-align:center">
          <h1 style="color:#fff;margin:0">CareerBridge</h1>
        </div>
        <div style="padding:32px;background:#fff">
          <h2 style="color:#142B4A">Welcome, ${fullName}!</h2>
          <p style="color:#1E293B">Please verify your email address to activate your account.</p>
          <a href="${url}" style="display:inline-block;margin:24px 0;padding:12px 32px;background:#2563EB;color:#fff;text-decoration:none;border-radius:8px;font-weight:600">
            Verify Email
          </a>
          <p style="color:#64748B;font-size:14px">This link expires in 24 hours. If you did not create an account, ignore this email.</p>
        </div>
      </div>
    `,
  });
};

export const sendPasswordResetEmail = async (email, fullName, token) => {
  const url = `${config.FRONTEND_URL}/reset-password?token=${token}`;
  await sendMail({
    to: email,
    subject: 'Reset your CareerBridge password',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
        <div style="background:#142B4A;padding:24px;text-align:center">
          <h1 style="color:#fff;margin:0">CareerBridge</h1>
        </div>
        <div style="padding:32px;background:#fff">
          <h2 style="color:#142B4A">Password Reset Request</h2>
          <p style="color:#1E293B">Hi ${fullName}, we received a request to reset your password.</p>
          <a href="${url}" style="display:inline-block;margin:24px 0;padding:12px 32px;background:#2563EB;color:#fff;text-decoration:none;border-radius:8px;font-weight:600">
            Reset Password
          </a>
          <p style="color:#64748B;font-size:14px">This link expires in 1 hour. If you did not request a reset, ignore this email.</p>
        </div>
      </div>
    `,
  });
};

export default { sendVerificationEmail, sendPasswordResetEmail };
