import * as appService from '../services/application.js';
import { sendSuccess, sendPaginated } from '../utils/response.js';

export const submit = async (req, res) => {
  const data = await appService.submitApplication(req.user.id, req.body);
  sendSuccess(res, data, 'Application submitted successfully', 201);
};
export const getMyApplications = async (req, res) => {
  const result = await appService.getMyApplications(req.user.id, req.query);
  sendPaginated(res, result.applications, result.pagination);
};
export const getApplication = async (req, res) => {
  const data = await appService.getApplicationById(req.user.id, req.params.id);
  sendSuccess(res, data);
};
export const withdraw = async (req, res) => {
  await appService.withdrawApplication(req.user.id, req.params.id);
  sendSuccess(res, null, 'Application withdrawn');
};
export const uploadDocument = async (req, res) => {
  if (!req.file) throw new Error('No file uploaded');
  const filePath = `/uploads/documents/${req.file.filename}`;
  const data = await appService.addApplicationDocument(req.user.id, req.params.id, req.file.originalname, filePath);
  sendSuccess(res, data, 'Document uploaded', 201);
};
// Employer
export const getEmployerApplications = async (req, res) => {
  const org = req.user.organization;
  const result = await appService.getEmployerApplications(org.id, req.query);
  sendPaginated(res, result.applications, result.pagination);
};
export const getEmployerApplication = async (req, res) => {
  const org = req.user.organization;
  const data = await appService.getEmployerApplicationById(org.id, req.params.id);
  sendSuccess(res, data);
};
export const updateStatus = async (req, res) => {
  const org = req.user.organization;
  const { applicationStatus, notes } = req.body;
  const data = await appService.updateApplicationStatus(org.id, req.params.id, applicationStatus, notes, req.user.id);
  sendSuccess(res, data, 'Status updated');
};
