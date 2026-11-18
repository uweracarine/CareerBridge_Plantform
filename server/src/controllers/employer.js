import * as employerService from '../services/employer.js';
import * as oppService from '../services/opportunity.js';
import { sendSuccess, sendPaginated } from '../utils/response.js';

export const getProfile = async (req, res) => {
  const org = await employerService.getOrCreateOrg(req.user.id);
  sendSuccess(res, org);
};
export const updateProfile = async (req, res) => {
  const org = await employerService.createOrUpdateOrg(req.user.id, req.body);
  sendSuccess(res, org, 'Organization profile updated');
};
export const uploadLogo = async (req, res) => {
  if (!req.file) throw new Error('No file uploaded');
  const filePath = `/uploads/logos/${req.file.filename}`;
  const org = await employerService.updateLogo(req.user.id, filePath);
  sendSuccess(res, org, 'Logo updated');
};
export const submitVerification = async (req, res) => {
  if (!req.file) throw new Error('No file uploaded');
  const filePath = `/uploads/documents/${req.file.filename}`;
  const doc = await employerService.submitVerificationDoc(req.user.id, req.body.documentType, filePath);
  sendSuccess(res, doc, 'Verification document submitted', 201);
};
export const getDashboard = async (req, res) => {
  const data = await employerService.getEmployerDashboard(req.user.id);
  sendSuccess(res, data);
};
export const getOpportunities = async (req, res) => {
  const org = await employerService.getOrCreateOrg(req.user.id);
  if (!org) return sendSuccess(res, { opportunities: [], pagination: {} });
  const result = await oppService.getEmployerOpportunities(org.id, req.query);
  sendPaginated(res, result.opportunities, result.pagination);
};
// Saved opportunities
export const saveOpportunity = async (req, res) => {
  await employerService.saveOpportunity(req.user.id, req.body.opportunity_id);
  sendSuccess(res, null, 'Saved', 201);
};
export const unsaveOpportunity = async (req, res) => {
  await employerService.unsaveOpportunity(req.user.id, req.params.id);
  sendSuccess(res, null, 'Removed from saved');
};
export const getSaved = async (req, res) => {
  const result = await employerService.getSavedOpportunities(req.user.id, req.query);
  sendPaginated(res, result.saved, result.pagination);
};
export const checkSaved = async (req, res) => {
  const data = await employerService.checkSaved(req.user.id, req.params.id);
  sendSuccess(res, data);
};
