import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

// Hash password
export const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

// Compare password
export const comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

// Generate JWT token
export const generateToken = (payload, expiresIn = process.env.JWT_EXPIRE || '24h') => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
};

// Generate Refresh Token
export const generateRefreshToken = (payload, expiresIn = process.env.JWT_REFRESH_EXPIRE || '7d') => {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn });
};

// Verify JWT token
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

// Verify Refresh Token
export const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch (error) {
    return null;
  }
};

// Extract token from header
export const extractToken = (authHeader) => {
  if (!authHeader) return null;
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return null;
  return parts[1];
};

export default {
  hashPassword,
  comparePassword,
  generateToken,
  generateRefreshToken,
  verifyToken,
  verifyRefreshToken,
  extractToken,
};
