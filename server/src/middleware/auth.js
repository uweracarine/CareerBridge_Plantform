import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import { AppError } from './errorHandler.js';
import prisma from '../config/database.js';

export const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      throw new AppError('No authentication token provided', 401);
    }

    const decoded = jwt.verify(token, config.JWT_SECRET);
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user || user.accountStatus === 'suspended') {
      throw new AppError('User not found or account suspended', 401);
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else {
      next(new AppError('Invalid token', 401));
    }
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError('Authentication required', 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(new AppError('Insufficient permissions', 403));
    }

    next();
  };
};

export const isOwner = (fieldName = 'userId') => {
  return (req, res, next) => {
    if (req.params[fieldName] !== req.user.id && req.user.role !== 'admin' && req.user.role !== 'super_admin') {
      return next(new AppError('Unauthorized access', 403));
    }
    next();
  };
};
