import { Router } from 'express';
import * as studentController from '../controllers/student.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { uploadProfilePhoto, uploadCV, handleUpload } from '../middleware/upload.js';

const router = Router();
const STUDENT_ROLES = ['student', 'graduate', 'job_seeker'];

router.use(authenticate);
router.use(authorize(...STUDENT_ROLES));

// Dashboard
router.get('/dashboard', studentController.getDashboard);

// Profile
router.get('/profile', studentController.getProfile);
router.put('/profile', studentController.updateProfile);
router.post('/profile/photo', handleUpload(uploadProfilePhoto), studentController.uploadProfilePhoto);

// Education
router.get('/education', studentController.getEducation);
router.post('/education', studentController.addEducation);
router.put('/education/:id', studentController.updateEducation);
router.delete('/education/:id', studentController.deleteEducation);

// Experience
router.get('/experience', studentController.getExperience);
router.post('/experience', studentController.addExperience);
router.put('/experience/:id', studentController.updateExperience);
router.delete('/experience/:id', studentController.deleteExperience);

// Skills
router.get('/skills/all', studentController.getSkills);
router.post('/skills', studentController.addSkill);
router.put('/skills/:id', studentController.updateSkill);
router.delete('/skills/:id', studentController.deleteSkill);

// Certifications
router.get('/certifications', studentController.getCertifications);
router.post('/certifications', studentController.addCertification);
router.put('/certifications/:id', studentController.updateCertification);
router.delete('/certifications/:id', studentController.deleteCertification);

// CVs
router.get('/cv', studentController.getCVs);
router.get('/cvs', studentController.getCVs);
router.post('/cv', handleUpload(uploadCV), studentController.uploadCV);
router.delete('/cv/:id', studentController.deleteCV);
router.patch('/cv/:id/default', studentController.setDefaultCV);

export default router;
