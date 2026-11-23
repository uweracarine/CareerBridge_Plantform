import * as features from '../services/features.js';
import { sendSuccess } from '../utils/response.js';

export const getJobAlerts = async (req, res) => sendSuccess(res, await features.getJobAlerts(req.user.id));
export const createJobAlert = async (req, res) => sendSuccess(res, await features.createJobAlert(req.user.id, req.body), 'Job alert created', 201);
export const updateJobAlert = async (req, res) => sendSuccess(res, await features.updateJobAlert(req.user.id, req.params.id, req.body), 'Job alert updated');
export const deleteJobAlert = async (req, res) => { await features.deleteJobAlert(req.user.id, req.params.id); sendSuccess(res, null, 'Job alert deleted'); };
export const getRecommendations = async (req, res) => sendSuccess(res, await features.getRecommendations(req.user.id));
export const scheduleInterview = async (req, res) => sendSuccess(res, await features.scheduleInterview(req.user.organization.id, req.user.id, req.params.applicationId, req.body), 'Interview scheduled', 201);
export const getOrganizationInterviews = async (req, res) => sendSuccess(res, await features.getInterviewsForOrganization(req.user.organization.id));
export const getStudentInterviews = async (req, res) => sendSuccess(res, await features.getInterviewsForStudent(req.user.id));
export const updateInterviewStatus = async (req, res) => sendSuccess(res, await features.updateInterviewStatus(req.user.organization.id, req.params.id, req.body.status), 'Interview updated');
export const reportOpportunity = async (req, res) => sendSuccess(res, await features.reportOpportunity(req.user.id, req.params.id, req.body), 'Report submitted', 201);
