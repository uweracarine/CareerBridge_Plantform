import { STORAGE_KEYS } from '../constants/index.js';

/**
 * Format date to display format
 */
export const formatDate = (date, format = 'MMM dd, yyyy') => {
  if (!date) return '';
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthName = monthNames[d.getMonth()];

  return format
    .replace('yyyy', year)
    .replace('MM', month)
    .replace('MMM', monthName)
    .replace('dd', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds);
};

/**
 * Format currency
 */
export const formatCurrency = (amount, currency = 'RWF') => {
  if (amount === null || amount === undefined) return '0';
  const num = parseFloat(amount);
  const currencySymbols = {
    RWF: 'FRw',
    USD: '$',
    EUR: '€',
  };
  const symbol = currencySymbols[currency.toUpperCase()] || currency;
  return `${symbol} ${num.toLocaleString()}`;
};

/**
 * Check if user has role
 */
export const hasRole = (userRole, requiredRole) => {
  if (Array.isArray(requiredRole)) {
    return requiredRole.includes(userRole);
  }
  return userRole === requiredRole;
};

/**
 * Get auth token from storage
 */
export const getToken = () => {
  return localStorage.getItem(STORAGE_KEYS.TOKEN);
};

/**
 * Set auth token in storage
 */
export const setToken = (token) => {
  localStorage.setItem(STORAGE_KEYS.TOKEN, token);
};

/**
 * Clear auth token from storage
 */
export const clearToken = () => {
  localStorage.removeItem(STORAGE_KEYS.TOKEN);
};

/**
 * Get user from storage
 */
export const getUser = () => {
  const user = localStorage.getItem(STORAGE_KEYS.USER);
  return user ? JSON.parse(user) : null;
};

/**
 * Set user in storage
 */
export const setUser = (user) => {
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
};

/**
 * Clear user from storage
 */
export const clearUser = () => {
  localStorage.removeItem(STORAGE_KEYS.USER);
};

/**
 * Validate email
 */
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

/**
 * Validate password strength
 */
export const validatePassword = (password) => {
  return password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password);
};

/**
 * Truncate text
 */
export const truncateText = (text, length = 100) => {
  if (!text) return '';
  if (text.length <= length) return text;
  return text.slice(0, length) + '...';
};

/**
 * Get initials from name
 */
export const getInitials = (name) => {
  if (!name) return '?';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

/**
 * Format file size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Validate file type
 */
export const isValidFileType = (file, allowedTypes = []) => {
  if (allowedTypes.length === 0) return true;
  return allowedTypes.includes(file.type);
};

/**
 * Validate file size
 */
export const isValidFileSize = (file, maxSizeMB = 10) => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
};

/**
 * Create slug from text
 */
export const createSlug = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-');
};

/**
 * Check if URL is external
 */
export const isExternalUrl = (url) => {
  return url.startsWith('http://') || url.startsWith('https://');
};

/**
 * Parse error response
 */
export const parseErrorResponse = (error) => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.response?.data?.errors) {
    const errors = error.response.data.errors;
    if (Array.isArray(errors)) {
      return errors[0].message || 'An error occurred';
    }
    if (typeof errors === 'object') {
      return Object.values(errors)[0] || 'An error occurred';
    }
  }
  return error.message || 'An error occurred';
};

/**
 * Debounce function
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle function
 */
export const throttle = (func, limit) => {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * Generate UUID
 */
export const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

/**
 * Sleep for milliseconds
 */
export const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export default {
  formatDate,
  formatCurrency,
  hasRole,
  getToken,
  setToken,
  clearToken,
  getUser,
  setUser,
  clearUser,
  validateEmail,
  validatePassword,
  truncateText,
  getInitials,
  formatFileSize,
  isValidFileType,
  isValidFileSize,
  createSlug,
  isExternalUrl,
  parseErrorResponse,
  debounce,
  throttle,
  generateUUID,
  sleep,
};
