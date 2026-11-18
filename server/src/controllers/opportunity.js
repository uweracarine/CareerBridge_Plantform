import * as oppService from '../services/opportunity.js';
import { sendSuccess, sendPaginated } from '../utils/response.js';

export const getOpportunities = async (req, res) => {
  const result = await oppService.getOpportunities(req.query);
  sendPaginated(res, result.opportunities, result.pagination);
};

export const getOpportunity = async (req, res) => {
  const data = await oppService.getOpportunityById(req.params.id);
  sendSuccess(res, data);
};

export const getFeatured = async (req, res) => {
  const data = await oppService.getFeatured();
  sendSuccess(res, data);
};

export const getCategories = async (req, res) => {
  const data = await oppService.getCategories();
  sendSuccess(res, data);
};

export const createOpportunity = async (req, res) => {
  const org = req.user.organization;
  if (!org) throw new Error('Organization profile required');
  const data = await oppService.createOpportunity(org.id, req.body);
  sendSuccess(res, data, 'Opportunity published and available to job seekers', 201);
};

export const updateOpportunity = async (req, res) => {
  const org = req.user.organization;
  const data = await oppService.updateOpportunity(org.id, req.params.id, req.body);
  sendSuccess(res, data, 'Opportunity updated');
};

export const deleteOpportunity = async (req, res) => {
  const org = req.user.organization;
  await oppService.deleteOpportunity(org.id, req.params.id);
  sendSuccess(res, null, 'Opportunity deleted');
};
