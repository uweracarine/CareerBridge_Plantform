import crypto from 'crypto';
import prisma from '../config/database.js';
import { hashPassword, comparePassword } from '../utils/password.js';
import { generateToken } from '../utils/jwt.js';
import { sendVerificationEmail, sendPasswordResetEmail } from '../utils/email.js';
import { AppError } from '../middleware/errorHandler.js';

// In-memory token store (use Redis in production)
const verificationTokens = new Map();
const resetTokens = new Map();

const generateSecureToken = () => crypto.randomBytes(32).toString('hex');

const sanitizeUser = (user) => ({
  id: user.id,
  fullName: user.fullName,
  email: user.email,
  phone: user.phone,
  role: user.role,
  profilePhoto: user.profilePhoto,
  emailVerifiedAt: user.emailVerifiedAt,
  accountStatus: user.accountStatus,
  createdAt: user.createdAt,
});

export const register = async ({ fullName, email, password, role }) => {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new AppError('Email already registered', 409);

  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({
    data: { fullName, email, passwordHash, role },
  });

  // Create student profile for non-employer roles
  if (role !== 'employer') {
    await prisma.studentProfile.create({ data: { userId: user.id } });
  }

  // Generate verification token (24h expiry)
  const token = generateSecureToken();
  verificationTokens.set(token, { userId: user.id, expiresAt: Date.now() + 24 * 60 * 60 * 1000 });

  await sendVerificationEmail(email, fullName, token);

  // Log activity
  await prisma.activityLog.create({
    data: { userId: user.id, action: 'user_registered', entityType: 'user', entityId: user.id },
  });

  return { user: sanitizeUser(user), emailSent: true };
};

export const login = async ({ email, password, ipAddress }) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new AppError('Invalid email or password', 401);

  if (user.accountStatus === 'suspended') {
    throw new AppError('Your account has been suspended. Contact support.', 403);
  }

  const valid = await comparePassword(password, user.passwordHash);
  if (!valid) throw new AppError('Invalid email or password', 401);

  const token = generateToken(user.id, user.role);

  await prisma.activityLog.create({
    data: {
      userId: user.id,
      action: 'user_login',
      entityType: 'user',
      entityId: user.id,
      ipAddress: ipAddress || null,
    },
  });

  return { user: sanitizeUser(user), token };
};

export const verifyEmail = async (token) => {
  const record = verificationTokens.get(token);
  if (!record) throw new AppError('Invalid or expired verification link', 400);
  if (Date.now() > record.expiresAt) {
    verificationTokens.delete(token);
    throw new AppError('Verification link has expired', 400);
  }

  await prisma.user.update({
    where: { id: record.userId },
    data: { emailVerifiedAt: new Date() },
  });

  verificationTokens.delete(token);
  return true;
};

export const forgotPassword = async (email) => {
  const user = await prisma.user.findUnique({ where: { email } });
  // Always return success to prevent email enumeration
  if (!user) return true;

  const token = generateSecureToken();
  resetTokens.set(token, { userId: user.id, expiresAt: Date.now() + 60 * 60 * 1000 });

  await sendPasswordResetEmail(email, user.fullName, token);
  return true;
};

export const resetPassword = async (token, newPassword) => {
  const record = resetTokens.get(token);
  if (!record) throw new AppError('Invalid or expired reset link', 400);
  if (Date.now() > record.expiresAt) {
    resetTokens.delete(token);
    throw new AppError('Reset link has expired', 400);
  }

  const passwordHash = await hashPassword(newPassword);
  await prisma.user.update({
    where: { id: record.userId },
    data: { passwordHash },
  });

  resetTokens.delete(token);
  return true;
};

export const changePassword = async (userId, currentPassword, newPassword) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  const valid = await comparePassword(currentPassword, user.passwordHash);
  if (!valid) throw new AppError('Current password is incorrect', 400);

  const passwordHash = await hashPassword(newPassword);
  await prisma.user.update({ where: { id: userId }, data: { passwordHash } });
  return true;
};

export const getMe = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      studentProfile: true,
      organization: { select: { id: true, organizationName: true, verificationStatus: true, logo: true } },
      adminPermissions: { select: { permissionName: true } },
    },
  });
  if (!user) throw new AppError('User not found', 404);

  return {
    ...sanitizeUser(user),
    studentProfile: user.studentProfile,
    organization: user.organization,
    permissions: user.adminPermissions.map((p) => p.permissionName),
  };
};

export const resendVerification = async (email) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return true; // prevent enumeration
  if (user.emailVerifiedAt) throw new AppError('Email already verified', 400);

  const token = generateSecureToken();
  verificationTokens.set(token, { userId: user.id, expiresAt: Date.now() + 24 * 60 * 60 * 1000 });
  await sendVerificationEmail(email, user.fullName, token);
  return true;
};
