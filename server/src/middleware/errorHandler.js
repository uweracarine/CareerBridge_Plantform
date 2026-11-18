import { config } from '../config/env.js';

export class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (err, req, res, next) => {
  const isDev = config.NODE_ENV === 'development';
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let errors = err.errors || null;

  // Prisma unique constraint
  if (err.code === 'P2002') {
    statusCode = 409;
    message = `${err.meta?.target?.[0] || 'Field'} already exists`;
  }

  // Prisma record not found
  if (err.code === 'P2025') {
    statusCode = 404;
    message = 'Record not found';
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') { statusCode = 401; message = 'Invalid token'; }
  if (err.name === 'TokenExpiredError') { statusCode = 401; message = 'Token expired'; }

  console.error(`[${statusCode}] ${message}${isDev && err.stack ? '\n' + err.stack : ''}`);

  res.status(statusCode).json({
    success: false,
    message,
    ...(errors && { errors }),
    ...(isDev && statusCode === 500 && { stack: err.stack }),
  });
};

export const notFound = (req, res, next) => {
  next(new AppError(`Route not found: ${req.originalUrl}`, 404));
};
