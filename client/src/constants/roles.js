export const USER_ROLES = {
  STUDENT: 'student',
  GRADUATE: 'graduate',
  JOB_SEEKER: 'job_seeker',
  EMPLOYER: 'employer',
  ADMIN: 'admin',
  SUPER_ADMIN: 'super_admin',
};

export const ROLE_LABELS = {
  student: 'Student',
  graduate: 'Graduate',
  job_seeker: 'Job Seeker',
  employer: 'Employer',
  admin: 'Administrator',
  super_admin: 'Super Administrator',
};

export const ACCOUNT_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended',
};

export const EMPLOYMENT_TYPES = {
  FULL_TIME: 'full_time',
  PART_TIME: 'part_time',
  INTERNSHIP: 'internship',
  CONTRACT: 'contract',
  FREELANCE: 'freelance',
  VOLUNTEER: 'volunteer',
};

export const WORK_ARRANGEMENTS = {
  REMOTE: 'remote',
  ONSITE: 'onsite',
  HYBRID: 'hybrid',
};

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

export const OPPORTUNITY_STATUSES = {
  DRAFT: 'draft',
  PENDING: 'pending',
  PUBLISHED: 'published',
  CLOSED: 'closed',
  REJECTED: 'rejected',
  EXPIRED: 'expired',
};

export const VERIFICATION_STATUSES = {
  PENDING: 'pending',
  VERIFIED: 'verified',
  REJECTED: 'rejected',
};
