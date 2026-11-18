import { z } from 'zod';

// Authentication Schemas
export const registerSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name is too long'),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain an uppercase letter')
    .regex(/[0-9]/, 'Password must contain a number'),
  confirm_password: z.string(),
  phone: z.string().min(10, 'Invalid phone number').optional().or(z.literal('')),
  role: z.enum(['student', 'graduate', 'job_seeker', 'employer']),
  terms_accepted: z.boolean().refine((val) => val === true, 'You must accept the terms'),
}).refine((data) => data.password === data.confirm_password, {
  message: 'Passwords do not match',
  path: ['confirm_password'],
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain an uppercase letter')
    .regex(/[0-9]/, 'Password must contain a number'),
  confirm_password: z.string(),
}).refine((data) => data.password === data.confirm_password, {
  message: 'Passwords do not match',
  path: ['confirm_password'],
});

// Student Profile Schemas
export const studentProfileSchema = z.object({
  headline: z.string().max(200, 'Headline is too long').optional().or(z.literal('')),
  biography: z.string().max(2000, 'Biography is too long').optional().or(z.literal('')),
  location: z.string().optional().or(z.literal('')),
  linkedin_url: z.string().url('Invalid URL').optional().or(z.literal('')),
  github_url: z.string().url('Invalid URL').optional().or(z.literal('')),
  portfolio_url: z.string().url('Invalid URL').optional().or(z.literal('')),
});

export const educationSchema = z.object({
  institution: z.string().min(2, 'Institution name is required'),
  qualification: z.string().min(2, 'Qualification is required'),
  field_of_study: z.string().min(2, 'Field of study is required'),
  start_date: z.string().min(1, 'Start date is required'),
  end_date: z.string().optional().or(z.literal('')),
  description: z.string().optional().or(z.literal('')),
});

export const experienceSchema = z.object({
  organization: z.string().min(2, 'Organization name is required'),
  job_title: z.string().min(2, 'Job title is required'),
  employment_type: z.enum(['full_time', 'part_time', 'contract', 'freelance']),
  start_date: z.string().min(1, 'Start date is required'),
  end_date: z.string().optional().or(z.literal('')),
  description: z.string().optional().or(z.literal('')),
});

export const skillSchema = z.object({
  skill_name: z.string().min(2, 'Skill name is required'),
  proficiency_level: z.enum(['beginner', 'intermediate', 'advanced', 'expert']),
});

export const certificationSchema = z.object({
  certification_name: z.string().min(2, 'Certification name is required'),
  issuing_organization: z.string().min(2, 'Organization is required'),
  issue_date: z.string().min(1, 'Issue date is required'),
  expiry_date: z.string().optional().or(z.literal('')),
});

// Opportunity Schemas
export const createOpportunitySchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(200, 'Title is too long'),
  category_id: z.string().min(1, 'Category is required'),
  description: z.string().min(50, 'Description must be at least 50 characters'),
  responsibilities: z.string().min(20, 'Responsibilities must be at least 20 characters'),
  qualifications: z.string().min(20, 'Qualifications must be at least 20 characters'),
  required_skills: z.string().optional().or(z.literal('')),
  location: z.string().min(1, 'Location is required'),
  work_arrangement: z.enum(['remote', 'onsite', 'hybrid']),
  employment_type: z.enum(['full_time', 'part_time', 'internship', 'contract', 'freelance', 'volunteer']),
  salary_min: z.number().optional().or(z.literal(null)),
  salary_max: z.number().optional().or(z.literal(null)),
  currency: z.enum(['rwf', 'usd', 'eur']).optional(),
  application_deadline: z.string().min(1, 'Application deadline is required'),
});

export const editOpportunitySchema = createOpportunitySchema.partial();

// Application Schemas
export const applicationSchema = z.object({
  opportunity_id: z.string().min(1, 'Opportunity is required'),
  cv_id: z.string().min(1, 'Please select a CV'),
  cover_letter: z.string().optional().or(z.literal('')),
});

// Organization Schemas
export const organizationProfileSchema = z.object({
  organization_name: z.string().min(2, 'Organization name is required').max(200),
  organization_type: z.enum(['private', 'ngo', 'government', 'startup', 'university', 'training', 'international']),
  industry: z.string().min(2, 'Industry is required'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  website: z.string().url('Invalid website URL').optional().or(z.literal('')),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Invalid phone number'),
  location: z.string().min(2, 'Location is required'),
});

// Search and Filter Schemas
export const searchOpportunitiesSchema = z.object({
  search: z.string().optional().or(z.literal('')),
  category: z.string().optional().or(z.literal('')),
  employment_type: z.string().optional().or(z.literal('')),
  work_arrangement: z.string().optional().or(z.literal('')),
  location: z.string().optional().or(z.literal('')),
  sort_by: z.enum(['recent', 'closing_soon', 'updated', 'alphabetical']).optional(),
  page: z.number().min(1).optional(),
  limit: z.number().min(1).max(100).optional(),
});

// Message Schemas
export const messageSchema = z.object({
  message: z.string().min(1, 'Message cannot be empty').max(5000, 'Message is too long'),
});

export default {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  studentProfileSchema,
  educationSchema,
  experienceSchema,
  skillSchema,
  certificationSchema,
  createOpportunitySchema,
  editOpportunitySchema,
  applicationSchema,
  organizationProfileSchema,
  searchOpportunitiesSchema,
  messageSchema,
};
