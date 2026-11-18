import { Router } from 'express';
import * as appCtrl from '../controllers/application.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { uploadDocument, handleUpload } from '../middleware/upload.js';
import prisma from '../config/database.js';

const router = Router();
const STUDENT_ROLES = ['student', 'graduate', 'job_seeker'];

// Attach org middleware for employer routes
const withOrg = async (req, res, next) => {
  const org = await prisma.organization.findUnique({ where: { ownerUserId: req.user.id } });
  if (!org) return res.status(400).json({ success: false, message: 'Organization profile required' });
  req.user.organization = org;
  next();
};

// Student application routes
router.post('/', authenticate, authorize(...STUDENT_ROLES), appCtrl.submit);
router.get('/my-applications', authenticate, authorize(...STUDENT_ROLES), appCtrl.getMyApplications);
router.get('/:id', authenticate, authorize(...STUDENT_ROLES), appCtrl.getApplication);
router.post('/:id/withdraw', authenticate, authorize(...STUDENT_ROLES), appCtrl.withdraw);
router.post('/:id/documents', authenticate, authorize(...STUDENT_ROLES), handleUpload(uploadDocument), appCtrl.uploadDocument);

// Employer application routes
router.get('/employer/all', authenticate, authorize('employer'), withOrg, appCtrl.getEmployerApplications);
router.get('/employer/:id', authenticate, authorize('employer'), withOrg, appCtrl.getEmployerApplication);
router.patch('/employer/:id/status', authenticate, authorize('employer'), withOrg, appCtrl.updateStatus);

export default router;
