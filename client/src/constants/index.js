// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// User Roles
export const ROLES = {
  STUDENT: 'student',
  GRADUATE: 'graduate',
  JOB_SEEKER: 'job_seeker',
  EMPLOYER: 'employer',
  ADMIN: 'admin',
  SUPER_ADMIN: 'super_admin',
};

// Application Statuses
export const APPLICATION_STATUSES = {
  SUBMITTED: 'submitted',
  UNDER_REVIEW: 'under_review',
  SHORTLISTED: 'shortlisted',
  INTERVIEW_SCHEDULED: 'interview_scheduled',
  ASSESSMENT: 'assessment',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  WITHDRAWN: 'withdrawn',
};

// Opportunity Statuses
export const OPPORTUNITY_STATUSES = {
  DRAFT: 'draft',
  PENDING: 'pending',
  PUBLISHED: 'published',
  CLOSED: 'closed',
  REJECTED: 'rejected',
  EXPIRED: 'expired',
};

// Employment Types
export const EMPLOYMENT_TYPES = {
  FULL_TIME: 'full_time',
  PART_TIME: 'part_time',
  INTERNSHIP: 'internship',
  CONTRACT: 'contract',
  FREELANCE: 'freelance',
  VOLUNTEER: 'volunteer',
};

// Work Arrangements
export const WORK_ARRANGEMENTS = {
  REMOTE: 'remote',
  ONSITE: 'onsite',
  HYBRID: 'hybrid',
};

// Opportunity Categories
export const OPPORTUNITY_CATEGORIES = [
  'Full-time Jobs',
  'Part-time Jobs',
  'Internships',
  'Graduate Programs',
  'Attachments',
  'Remote Jobs',
  'Freelance',
  'Training',
  'Scholarships',
  'Fellowships',
  'Apprenticeships',
  'Volunteer',
];

// Verification Statuses
export const VERIFICATION_STATUSES = {
  PENDING: 'pending',
  VERIFIED: 'verified',
  REJECTED: 'rejected',
};

// Currency
export const CURRENCIES = {
  RWF: 'rwf',
  USD: 'usd',
  EUR: 'eur',
};

// Proficiency Levels
export const PROFICIENCY_LEVELS = {
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced',
  EXPERT: 'expert',
};

// Notification Types
export const NOTIFICATION_TYPES = {
  REGISTRATION: 'registration',
  VERIFICATION: 'verification',
  APPLICATION: 'application',
  MESSAGE: 'message',
  DEADLINE: 'deadline',
  OPPORTUNITY: 'opportunity',
  ADMIN: 'admin',
};

// Account Status
export const ACCOUNT_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended',
};

// Organization Types
export const ORGANIZATION_TYPES = {
  PRIVATE: 'private',
  NGO: 'ngo',
  GOVERNMENT: 'government',
  STARTUP: 'startup',
  UNIVERSITY: 'university',
  TRAINING: 'training',
  INTERNATIONAL: 'international',
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  NOT_FOUND: 'Resource not found.',
  BAD_REQUEST: 'Invalid request. Please check your input.',
  VALIDATION_ERROR: 'Validation error. Please check your input.',
  DUPLICATE_ERROR: 'This record already exists.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  REGISTRATION_SUCCESS: 'Registration successful! Please verify your email.',
  LOGIN_SUCCESS: 'Login successful!',
  LOGOUT_SUCCESS: 'Logged out successfully.',
  UPDATE_SUCCESS: 'Updated successfully.',
  DELETE_SUCCESS: 'Deleted successfully.',
  CREATE_SUCCESS: 'Created successfully.',
  APPLICATION_SUBMITTED: 'Application submitted successfully!',
};

// LocalStorage Keys
export const STORAGE_KEYS = {
  TOKEN: 'careerbridge_token',
  REFRESH_TOKEN: 'careerbridge_refresh_token',
  USER: 'careerbridge_user',
  PREFERENCES: 'careerbridge_preferences',
};

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM dd, yyyy',
  DISPLAY_WITH_TIME: 'MMM dd, yyyy HH:mm',
  API: 'yyyy-MM-dd',
  API_WITH_TIME: 'yyyy-MM-ddTHH:mm:ss',
};

export default {
  API_BASE_URL,
  ROLES,
  APPLICATION_STATUSES,
  OPPORTUNITY_STATUSES,
  EMPLOYMENT_TYPES,
  WORK_ARRANGEMENTS,
  OPPORTUNITY_CATEGORIES,
  VERIFICATION_STATUSES,
  CURRENCIES,
  PROFICIENCY_LEVELS,
  NOTIFICATION_TYPES,
  ACCOUNT_STATUS,
  ORGANIZATION_TYPES,
  PAGINATION,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  STORAGE_KEYS,
  DATE_FORMATS,
};
