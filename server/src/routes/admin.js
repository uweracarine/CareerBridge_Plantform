import { Router } from 'express';
import * as adminCtrl from '../controllers/admin.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();
router.use(authenticate, authorize('admin', 'super_admin'));

router.get('/dashboard', adminCtrl.getDashboard);
router.get('/analytics', adminCtrl.getAnalytics);
router.get('/activity-logs', adminCtrl.getActivityLogs);

router.get('/users', adminCtrl.getUsers);
router.patch('/users/:id/status', adminCtrl.updateUserStatus);

router.get('/employers', adminCtrl.getEmployers);
router.patch('/employers/:id/verify', adminCtrl.verifyOrganization);

router.get('/opportunities', adminCtrl.getOpportunities);
router.patch('/opportunities/:id/moderate', adminCtrl.moderateOpportunity);

router.get('/categories', adminCtrl.getCategories);
router.post('/categories', adminCtrl.createCategory);
router.put('/categories/:id', adminCtrl.updateCategory);
router.delete('/categories/:id', adminCtrl.deleteCategory);

router.post('/admins', authorize('super_admin'), adminCtrl.createAdminUser);

export default router;
