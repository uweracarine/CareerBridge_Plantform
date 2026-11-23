import axios from 'axios';
import { API_BASE_URL, STORAGE_KEYS } from '../constants/index.js';
import { getToken } from '../utils/index.js';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401 && !window.location.pathname.includes('/login')) {
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth Endpoints
export const authService = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  verifyEmail: (token) => api.post('/auth/verify-email', { token }),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.post('/auth/reset-password', { token, password }),
  me: () => api.get('/auth/me'),
  refreshToken: () => api.post('/auth/refresh-token'),
};

// Student Profile Endpoints
export const studentService = {
  getProfile: () => api.get('/students/profile'),
  updateProfile: (data) => api.put('/students/profile', data),
  uploadProfilePhoto: (formData) => api.post('/students/profile/photo', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  
  // Education
  getEducation: () => api.get('/students/education'),
  addEducation: (data) => api.post('/students/education', data),
  updateEducation: (id, data) => api.put(`/students/education/${id}`, data),
  deleteEducation: (id) => api.delete(`/students/education/${id}`),
  
  // Experience
  getExperience: () => api.get('/students/experience'),
  addExperience: (data) => api.post('/students/experience', data),
  updateExperience: (id, data) => api.put(`/students/experience/${id}`, data),
  deleteExperience: (id) => api.delete(`/students/experience/${id}`),
  
  // Skills
  getSkills: () => api.get('/students/skills/all'),
  addSkill: (data) => api.post('/students/skills', data),
  updateSkill: (id, data) => api.put(`/students/skills/${id}`, data),
  deleteSkill: (id) => api.delete(`/students/skills/${id}`),
  
  // Certifications
  getCertifications: () => api.get('/students/certifications'),
  addCertification: (data) => api.post('/students/certifications', data),
  updateCertification: (id, data) => api.put(`/students/certifications/${id}`, data),
  deleteCertification: (id) => api.delete(`/students/certifications/${id}`),
  
  // CVs
  getCVs: () => api.get('/students/cv'),
  uploadCV: (formData) => api.post('/students/cv', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  deleteCV: (id) => api.delete(`/students/cv/${id}`),
  setDefaultCV: (id) => api.patch(`/students/cv/${id}/default`),
  
  // Dashboard
  getDashboard: () => api.get('/students/dashboard'),
};

// Opportunity Endpoints
export const opportunityService = {
  getOpportunities: (params) => api.get('/opportunities', { params }),
  getOpportunity: (id) => api.get(`/opportunities/${id}`),
  createOpportunity: (data) => api.post('/opportunities', data),
  updateOpportunity: (id, data) => api.put(`/opportunities/${id}`, data),
  deleteOpportunity: (id) => api.delete(`/opportunities/${id}`),
  getFeatured: () => api.get('/opportunities/featured'),
  getCategories: () => api.get('/opportunities/categories'),
  search: (params) => api.get('/opportunities', { params }),
};

// Application Endpoints
export const applicationService = {
  submit: (data) => api.post('/applications', data),
  getMyApplications: (params) => api.get('/applications/my-applications', { params }),
  getApplication: (id) => api.get(`/applications/${id}`),
  getApplications: (params) => api.get('/applications/employer/all', { params }),
  getEmployerApplication: (id) => api.get(`/applications/employer/${id}`),
  updateStatus: (id, status, notes = '') => api.patch(`/applications/employer/${id}/status`, {
    applicationStatus: status,
    notes,
  }),
  withdraw: (id) => api.post(`/applications/${id}/withdraw`),
  uploadDocument: (id, formData) => api.post(`/applications/${id}/documents`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
};

// Employer Endpoints
export const employerService = {
  getProfile: () => api.get('/employers/profile'),
  updateProfile: (data) => api.put('/employers/profile', data),
  uploadLogo: (formData) => api.post('/employers/profile/logo', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  submitVerification: (formData) => api.post('/employers/verification', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  getOpportunities: (params) => api.get('/employers/opportunities', { params }),
  getApplications: (params) => api.get('/applications/employer/all', { params }),
  getCandidateDetails: (id) => api.get(`/employers/candidates/${id}`),
  shortlistCandidate: (data) => api.post('/employers/shortlist', data),
  updateApplicationStatus: (id, status, notes = '') => api.patch(`/applications/employer/${id}/status`, { applicationStatus: status, notes }),
  getDashboard: () => api.get('/employers/dashboard'),
};

// Message Endpoints
export const messageService = {
  getConversations: (params) => api.get('/messages/conversations', { params }),
  startConversation: (opportunityId, applicantId) => api.post('/messages/conversations', { opportunityId, applicantId }),
  getConversation: (id) => api.get(`/messages/conversations/${id}`),
  markAsRead: (id) => api.patch(`/messages/conversations/${id}/read`),
  sendMessage: (conversationId, message) => api.post(`/messages/conversations/${conversationId}/send`, { message }),
  getUnreadCount: () => api.get('/messages/unread-count'),
};

// Notification Endpoints
export const notificationService = {
  getNotifications: (params) => api.get('/notifications', { params }),
  markAsRead: (id) => api.patch(`/notifications/${id}/read`),
  markAllAsRead: () => api.patch('/notifications/read-all'),
  delete: (id) => api.delete(`/notifications/${id}`),
};

// Saved Opportunities Endpoints
export const savedOpportunitiesService = {
  getSaved: (params) => api.get('/saved-opportunities', { params }),
  save: (opportunityId) => api.post('/saved-opportunities', { opportunity_id: opportunityId }),
  unsave: (opportunityId) => api.delete(`/saved-opportunities/${opportunityId}`),
  isSaved: (opportunityId) => api.get(`/saved-opportunities/${opportunityId}/check`),
};

// Admin Endpoints
export const adminService = {
  getDashboard: () => api.get('/admin/dashboard'),
  getUsers: (params) => api.get('/admin/users', { params }),
  getUser: (id) => api.get(`/admin/users/${id}`),
  updateUserStatus: (id, status) => api.patch(`/admin/users/${id}/status`, { accountStatus: status }),
  suspendUser: (id, reason) => api.post(`/admin/users/${id}/suspend`, { reason }),
  
  getEmployers: (params) => api.get('/admin/employers', { params }),
  getEmployer: (id) => api.get(`/admin/employers/${id}`),
  verifyEmployer: (id, status) => api.patch(`/admin/employers/${id}/verify`, { verificationStatus: status }),
  
  getOpportunities: (params) => api.get('/admin/opportunities', { params }),
  approveOpportunity: (id) => api.patch(`/admin/opportunities/${id}/moderate`, { action: 'approve' }),
  rejectOpportunity: (id, reason) => api.patch(`/admin/opportunities/${id}/moderate`, { action: 'reject', reason }),
  moderateOpportunity: (id, action, reason) => api.patch(`/admin/opportunities/${id}/moderate`, { action, reason }),
  
  getApplications: (params) => api.get('/admin/applications', { params }),
  
  getReports: (params) => api.get('/admin/reports', { params }),
  getAnalytics: (params) => api.get('/admin/analytics', { params }),
  getActivityLogs: (params) => api.get('/admin/activity-logs', { params }),
  
  getCategories: () => api.get('/admin/categories'),
  createCategory: (data) => api.post('/admin/categories', data),
  updateCategory: (id, data) => api.put(`/admin/categories/${id}`, data),
  deleteCategory: (id) => api.delete(`/admin/categories/${id}`),
  createAdmin: (data) => api.post('/admin/admins', data),
};

// Career Resources Endpoints
export const resourceService = {
  getResources: (params) => api.get('/resources', { params }),
  getResource: (id) => api.get(`/resources/${id}`),
  createResource: (data) => api.post('/resources', data),
  updateResource: (id, data) => api.put(`/resources/${id}`, data),
  deleteResource: (id) => api.delete(`/resources/${id}`),
};

// Career Feature Endpoints
export const featureService = {
  getAlerts: () => api.get('/features/alerts'),
  createAlert: (data) => api.post('/features/alerts', data),
  updateAlert: (id, data) => api.put(`/features/alerts/${id}`, data),
  deleteAlert: (id) => api.delete(`/features/alerts/${id}`),
  getRecommendations: () => api.get('/features/recommendations'),
  getStudentInterviews: () => api.get('/features/interviews'),
  getEmployerInterviews: () => api.get('/features/employer/interviews'),
  scheduleInterview: (applicationId, data) => api.post(`/features/employer/applications/${applicationId}/interview`, data),
  updateInterviewStatus: (id, status) => api.patch(`/features/employer/interviews/${id}/status`, { status }),
  reportOpportunity: (id, data) => api.post(`/features/opportunities/${id}/report`, data),
};

export default api;
