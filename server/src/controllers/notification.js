import * as notifService from '../services/notification.js';
import { sendSuccess, sendPaginated } from '../utils/response.js';

export const getNotifications = async (req, res) => {
  const result = await notifService.getNotifications(req.user.id, req.query);
  sendPaginated(res, result.notifications, result.pagination, 'Success', 200);
  // attach unreadCount to response
  res.locals.unreadCount = result.unreadCount;
};
export const markAsRead = async (req, res) => {
  await notifService.markAsRead(req.user.id, req.params.id);
  sendSuccess(res, null, 'Marked as read');
};
export const markAllAsRead = async (req, res) => {
  await notifService.markAllAsRead(req.user.id);
  sendSuccess(res, null, 'All marked as read');
};
export const deleteNotification = async (req, res) => {
  await notifService.deleteNotification(req.user.id, req.params.id);
  sendSuccess(res, null, 'Deleted');
};
