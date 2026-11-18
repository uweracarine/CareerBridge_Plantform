import { Router } from 'express';
import * as oppController from '../controllers/opportunity.js';
import { authenticate, authorize } from '../middleware/auth.js';
import prisma from '../config/database.js';

const router = Router();

// Public routes
router.get('/', oppController.getOpportunities);
router.get('/featured', oppController.getFeatured);
router.get('/categories', oppController.getCategories);
router.get('/:id', oppController.getOpportunity);

// Employer routes — attach organization to req.user
const withOrg = async (req, res, next) => {
  const org = await prisma.organization.findUnique({ where: { ownerUserId: req.user.id } });
  if (!org) return res.status(400).json({ success: false, message: 'Create an organization profile first' });
  if (org.verificationStatus !== 'verified') return res.status(403).json({ success: false, message: 'Organization must be verified to post opportunities' });
  req.user.organization = org;
  next();
};

router.post('/', authenticate, authorize('employer'), withOrg, oppController.createOpportunity);
router.put('/:id', authenticate, authorize('employer'), withOrg, oppController.updateOpportunity);
router.delete('/:id', authenticate, authorize('employer'), withOrg, oppController.deleteOpportunity);

export default router;
