import { Router } from 'express';
import * as msgCtrl from '../controllers/message.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();
router.use(authenticate);
router.get('/conversations', msgCtrl.getConversations);
router.post('/conversations', msgCtrl.startConversation);
router.get('/conversations/:id', msgCtrl.getMessages);
router.patch('/conversations/:id/read', msgCtrl.markConversationAsRead);
router.post('/conversations/:id/send', msgCtrl.sendMessage);
router.get('/unread-count', msgCtrl.getUnreadCount);
export default router;
