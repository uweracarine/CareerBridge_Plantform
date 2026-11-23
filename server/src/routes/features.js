import { Router } from 'express';
import prisma from '../config/database.js';
import { authenticate, authorize } from '../middleware/auth.js';
import * as controller from '../controllers/features.js';

const router = Router();
const studentRoles = ['student', 'graduate', 'job_seeker'];

const withOrg = async (req, res, next) => {
  const organization = await prisma.organization.findUnique({ where: { ownerUserId: req.user.id } });
  if (!organization) return res.status(400).json({ success: false, message: 'Organization profile required' });
  req.user.organization = organization;
  next();
};

router.get('/alerts', authenticate, authorize(...studentRoles), controller.getJobAlerts);
router.post('/alerts', authenticate, authorize(...studentRoles), controller.createJobAlert);
router.put('/alerts/:id', authenticate, authorize(...studentRoles), controller.updateJobAlert);
router.delete('/alerts/:id', authenticate, authorize(...studentRoles), controller.deleteJobAlert);
router.get('/recommendations', authenticate, authorize(...studentRoles), controller.getRecommendations);
router.get('/interviews', authenticate, authorize(...studentRoles), controller.getStudentInterviews);
router.post('/opportunities/:id/report', authenticate, controller.reportOpportunity);

router.get('/employer/interviews', authenticate, authorize('employer'), withOrg, controller.getOrganizationInterviews);
router.post('/employer/applications/:applicationId/interview', authenticate, authorize('employer'), withOrg, controller.scheduleInterview);
router.patch('/employer/interviews/:id/status', authenticate, authorize('employer'), withOrg, controller.updateInterviewStatus);

export default router;
