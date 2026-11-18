import * as studentService from '../services/student.js';
import { sendSuccess } from '../utils/response.js';
import path from 'path';

export const getProfile = async (req, res) => {
  const data = await studentService.getProfile(req.user.id);
  sendSuccess(res, data);
};

export const updateProfile = async (req, res) => {
  const data = await studentService.updateProfile(req.user.id, req.body);
  sendSuccess(res, data, 'Profile updated successfully');
};

export const uploadProfilePhoto = async (req, res) => {
  if (!req.file) throw new Error('No file uploaded');
  const filePath = `/uploads/profiles/${req.file.filename}`;
  await studentService.updateProfilePhoto(req.user.id, filePath);
  sendSuccess(res, { profilePhoto: filePath }, 'Profile photo updated');
};

export const getDashboard = async (req, res) => {
  const data = await studentService.getDashboard(req.user.id);
  sendSuccess(res, data);
};

export const getEducation = async (req, res) => {
  const data = await studentService.getEducation(req.user.id);
  sendSuccess(res, data);
};

export const getExperience = async (req, res) => {
  const data = await studentService.getExperience(req.user.id);
  sendSuccess(res, data);
};

export const getCertifications = async (req, res) => {
  const data = await studentService.getCertifications(req.user.id);
  sendSuccess(res, data);
};

export const getCVs = async (req, res) => {
  const data = await studentService.getCVs(req.user.id);
  sendSuccess(res, data);
};

// Education
export const addEducation = async (req, res) => {
  const data = await studentService.addEducation(req.user.id, req.body);
  sendSuccess(res, data, 'Education added', 201);
};
export const updateEducation = async (req, res) => {
  const data = await studentService.updateEducation(req.user.id, req.params.id, req.body);
  sendSuccess(res, data, 'Education updated');
};
export const deleteEducation = async (req, res) => {
  await studentService.deleteEducation(req.user.id, req.params.id);
  sendSuccess(res, null, 'Education deleted');
};

// Experience
export const addExperience = async (req, res) => {
  const data = await studentService.addExperience(req.user.id, req.body);
  sendSuccess(res, data, 'Experience added', 201);
};
export const updateExperience = async (req, res) => {
  const data = await studentService.updateExperience(req.user.id, req.params.id, req.body);
  sendSuccess(res, data, 'Experience updated');
};
export const deleteExperience = async (req, res) => {
  await studentService.deleteExperience(req.user.id, req.params.id);
  sendSuccess(res, null, 'Experience deleted');
};

// Skills
export const getSkills = async (req, res) => {
  const data = await studentService.getSkills();
  sendSuccess(res, data);
};
export const addSkill = async (req, res) => {
  const { skillName, proficiencyLevel } = req.body;
  const data = await studentService.addSkill(req.user.id, skillName, proficiencyLevel);
  sendSuccess(res, data, 'Skill added', 201);
};
export const updateSkill = async (req, res) => {
  const data = await studentService.updateSkill(req.user.id, req.params.id, req.body.proficiencyLevel);
  sendSuccess(res, data, 'Skill updated');
};
export const deleteSkill = async (req, res) => {
  await studentService.deleteSkill(req.user.id, req.params.id);
  sendSuccess(res, null, 'Skill deleted');
};

// Certifications
export const addCertification = async (req, res) => {
  const data = await studentService.addCertification(req.user.id, req.body);
  sendSuccess(res, data, 'Certification added', 201);
};
export const updateCertification = async (req, res) => {
  const data = await studentService.updateCertification(req.user.id, req.params.id, req.body);
  sendSuccess(res, data, 'Certification updated');
};
export const deleteCertification = async (req, res) => {
  await studentService.deleteCertification(req.user.id, req.params.id);
  sendSuccess(res, null, 'Certification deleted');
};

// CVs
export const uploadCV = async (req, res) => {
  if (!req.file) throw new Error('No file uploaded');
  const filePath = `/uploads/cvs/${req.file.filename}`;
  const data = await studentService.uploadCV(req.user.id, req.file.originalname, filePath);
  sendSuccess(res, data, 'CV uploaded', 201);
};
export const deleteCV = async (req, res) => {
  await studentService.deleteCV(req.user.id, req.params.id);
  sendSuccess(res, null, 'CV deleted');
};
export const setDefaultCV = async (req, res) => {
  const data = await studentService.setDefaultCV(req.user.id, req.params.id);
  sendSuccess(res, data, 'Default CV updated');
};
