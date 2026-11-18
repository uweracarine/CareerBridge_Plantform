import dotenv from 'dotenv';

dotenv.config();

const getEnv = (key, defaultValue = '') => {
  const value = process.env[key];
  if (!value && !defaultValue) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value || defaultValue;
};

export const config = {
  // Server
  PORT: parseInt(getEnv('PORT', '5000'), 10),
  NODE_ENV: getEnv('NODE_ENV', 'development'),
  LOG_LEVEL: getEnv('LOG_LEVEL', 'info'),

  // Database
  DATABASE_URL: getEnv('DATABASE_URL'),

  // JWT
  JWT_SECRET: getEnv('JWT_SECRET'),
  JWT_EXPIRE: getEnv('JWT_EXPIRE', '7d'),

  // CORS
  CORS_ORIGIN: getEnv('CORS_ORIGIN', 'http://localhost:5173'),

  // Email
  SMTP_HOST: getEnv('SMTP_HOST', 'smtp.gmail.com'),
  SMTP_PORT: parseInt(getEnv('SMTP_PORT', '587'), 10),
  SMTP_USER: getEnv('SMTP_USER', ''),
  SMTP_PASS: getEnv('SMTP_PASS', ''),
  MAIL_FROM: getEnv('MAIL_FROM', 'noreply@careerbridge.rw'),

  // File Upload
  MAX_FILE_SIZE: parseInt(getEnv('MAX_FILE_SIZE', '5242880'), 10),
  UPLOAD_PATH: getEnv('UPLOAD_PATH', './uploads'),

  // URLs
  API_BASE_URL: getEnv('API_BASE_URL', 'http://localhost:5000'),
  FRONTEND_URL: getEnv('FRONTEND_URL', 'http://localhost:5173'),

  // Feature flags
  ENABLE_EMAIL: getEnv('ENABLE_EMAIL', 'false') === 'true',
};

export default config;
