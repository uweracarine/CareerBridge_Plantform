import { Router } from 'express';
import * as notifCtrl from '../controllers/notification.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();
router.use(authenticate);
router.get('/', notifCtrl.getNotifications);
router.patch('/read-all', notifCtrl.markAllAsRead);
router.patch('/:id/read', notifCtrl.markAsRead);
router.delete('/:id', notifCtrl.deleteNotification);
export default router;
