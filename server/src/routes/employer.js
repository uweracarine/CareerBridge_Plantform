import { Router } from 'express';
import * as employerCtrl from '../controllers/employer.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { uploadLogo, uploadDocument, handleUpload } from '../middleware/upload.js';

const router = Router();
router.use(authenticate, authorize('employer'));

router.get('/dashboard', employerCtrl.getDashboard);
router.get('/profile', employerCtrl.getProfile);
router.put('/profile', employerCtrl.updateProfile);
router.post('/profile/logo', handleUpload(uploadLogo), employerCtrl.uploadLogo);
router.post('/verification', handleUpload(uploadDocument), employerCtrl.submitVerification);
router.get('/opportunities', employerCtrl.getOpportunities);

export default router;
