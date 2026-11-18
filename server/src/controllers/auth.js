import * as authService from '../services/auth.js';
import { sendSuccess } from '../utils/response.js';

export const register = async (req, res) => {
  const { fullName, email, password, role } = req.body;
  const result = await authService.register({ fullName, email, password, role });
  sendSuccess(res, result, 'Registration successful. Please check your email to verify your account.', 201);
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const ipAddress = req.ip || req.headers['x-forwarded-for'];
  const result = await authService.login({ email, password, ipAddress });
  sendSuccess(res, result, 'Login successful');
};

export const verifyEmail = async (req, res) => {
  const { token } = req.body;
  await authService.verifyEmail(token);
  sendSuccess(res, null, 'Email verified successfully');
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  await authService.forgotPassword(email);
  sendSuccess(res, null, 'If that email exists, a reset link has been sent.');
};

export const resetPassword = async (req, res) => {
  const { token, password } = req.body;
  await authService.resetPassword(token, password);
  sendSuccess(res, null, 'Password reset successfully. You can now log in.');
};

export const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  await authService.changePassword(req.user.id, currentPassword, newPassword);
  sendSuccess(res, null, 'Password changed successfully');
};

export const getMe = async (req, res) => {
  const user = await authService.getMe(req.user.id);
  sendSuccess(res, user);
};

export const logout = async (req, res) => {
  // JWT is stateless; client removes token. Log the event.
  sendSuccess(res, null, 'Logged out successfully');
};

export const resendVerification = async (req, res) => {
  const { email } = req.body;
  await authService.resendVerification(email);
  sendSuccess(res, null, 'Verification email sent if account exists.');
};
