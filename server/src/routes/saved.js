import { Router } from 'express';
import * as employerCtrl from '../controllers/employer.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();
router.use(authenticate);
router.get('/', employerCtrl.getSaved);
router.post('/', employerCtrl.saveOpportunity);
router.get('/:id/check', employerCtrl.checkSaved);
router.delete('/:id', employerCtrl.unsaveOpportunity);
export default router;
