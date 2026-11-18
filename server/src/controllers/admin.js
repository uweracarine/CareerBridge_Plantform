import * as adminService from '../services/admin.js';
import { sendSuccess, sendPaginated } from '../utils/response.js';

export const getDashboard = async (req, res) => {
  const data = await adminService.getDashboardStats();
  sendSuccess(res, data);
};
export const getUsers = async (req, res) => {
  const result = await adminService.getUsers(req.query);
  sendPaginated(res, result.users, result.pagination);
};
export const updateUserStatus = async (req, res) => {
  await adminService.updateUserStatus(req.user.id, req.params.id, req.body.accountStatus, req.body.reason);
  sendSuccess(res, null, 'User status updated');
};
export const getEmployers = async (req, res) => {
  const result = await adminService.getEmployers(req.query);
  sendPaginated(res, result.employers, result.pagination);
};
export const verifyOrganization = async (req, res) => {
  await adminService.verifyOrganization(req.user.id, req.params.id, req.body.verificationStatus, req.body.notes);
  sendSuccess(res, null, 'Organization status updated');
};
export const getOpportunities = async (req, res) => {
  const result = await adminService.getAdminOpportunities(req.query);
  sendPaginated(res, result.opportunities, result.pagination);
};
export const moderateOpportunity = async (req, res) => {
  await adminService.moderateOpportunity(req.user.id, req.params.id, req.body.action, req.body.reason);
  sendSuccess(res, null, 'Opportunity updated');
};
export const getCategories = async (req, res) => {
  const data = await adminService.getCategories();
  sendSuccess(res, data);
};
export const createCategory = async (req, res) => {
  const data = await adminService.createCategory(req.body);
  sendSuccess(res, data, 'Category created', 201);
};
export const updateCategory = async (req, res) => {
  const data = await adminService.updateCategory(req.params.id, req.body);
  sendSuccess(res, data, 'Category updated');
};
export const deleteCategory = async (req, res) => {
  await adminService.deleteCategory(req.params.id);
  sendSuccess(res, null, 'Category deleted');
};
export const getActivityLogs = async (req, res) => {
  const result = await adminService.getActivityLogs(req.query);
  sendPaginated(res, result.logs, result.pagination);
};
export const getAnalytics = async (req, res) => {
  const data = await adminService.getAnalytics();
  sendSuccess(res, data);
};
export const createAdminUser = async (req, res) => {
  const data = await adminService.createAdminUser(req.user.id, req.body);
  sendSuccess(res, data, 'Admin user created', 201);
};
