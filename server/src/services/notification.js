import prisma from '../config/database.js';

export const createNotification = async (userId, { title, message, type = 'admin' }) => {
  return prisma.notification.create({ data: { userId, title, message, notificationType: type } });
};

export const getNotifications = async (userId, { page = 1, limit = 20, unreadOnly = false }) => {
  const where = { userId, ...(unreadOnly && { isRead: false }) };
  const [total, unread, notifications] = await Promise.all([
    prisma.notification.count({ where }),
    prisma.notification.count({ where: { userId, isRead: false } }),
    prisma.notification.findMany({ where, orderBy: { createdAt: 'desc' }, skip: (page - 1) * limit, take: Number(limit) }),
  ]);
  return { notifications, unreadCount: unread, pagination: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / limit) } };
};

export const markAsRead = async (userId, id) => {
  const n = await prisma.notification.findFirst({ where: { id, userId } });
  if (!n) return;
  return prisma.notification.update({ where: { id }, data: { isRead: true } });
};

export const markAllAsRead = async (userId) => {
  return prisma.notification.updateMany({ where: { userId, isRead: false }, data: { isRead: true } });
};

export const deleteNotification = async (userId, id) => {
  await prisma.notification.deleteMany({ where: { id, userId } });
};
