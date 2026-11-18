import prisma from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';
import { createNotification } from './notification.js';
import { hashPassword } from '../utils/password.js';

export const getDashboardStats = async () => {
  const [totalUsers, students, employers, verifiedEmployers, pendingVerifications, totalOpps, publishedOpps, pendingOpps, totalApps, recentUsers, recentActivity] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: { in: ['student', 'graduate', 'job_seeker'] } } }),
    prisma.user.count({ where: { role: 'employer' } }),
    prisma.organization.count({ where: { verificationStatus: 'verified' } }),
    prisma.organization.count({ where: { verificationStatus: 'pending' } }),
    prisma.opportunity.count(),
    prisma.opportunity.count({ where: { status: 'published' } }),
    prisma.opportunity.count({ where: { status: 'pending' } }),
    prisma.application.count(),
    prisma.user.findMany({ orderBy: { createdAt: 'desc' }, take: 5, select: { id: true, fullName: true, email: true, role: true, createdAt: true, accountStatus: true } }),
    prisma.activityLog.findMany({ orderBy: { createdAt: 'desc' }, take: 10, include: { user: { select: { fullName: true, role: true } } } }),
  ]);
  return { totalUsers, students, employers, verifiedEmployers, pendingVerifications, totalOpps, publishedOpps, pendingOpps, totalApps, recentUsers, recentActivity };
};

export const getUsers = async ({ page = 1, limit = 15, q, role, status }) => {
  const where = {
    ...(q && { OR: [{ fullName: { contains: q } }, { email: { contains: q } }] }),
    ...(role && { role }),
    ...(status && { accountStatus: status }),
  };
  const [total, users] = await Promise.all([
    prisma.user.count({ where }),
    prisma.user.findMany({ where, orderBy: { createdAt: 'desc' }, skip: (page - 1) * limit, take: Number(limit), select: { id: true, fullName: true, email: true, phone: true, role: true, accountStatus: true, emailVerifiedAt: true, createdAt: true, profilePhoto: true } }),
  ]);
  return { users, pagination: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / limit) } };
};

export const updateUserStatus = async (adminId, userId, accountStatus, reason) => {
  if (userId === adminId) throw new AppError('Cannot modify your own account status', 400);
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new AppError('User not found', 404);
  await prisma.user.update({ where: { id: userId }, data: { accountStatus } });
  await prisma.activityLog.create({ data: { userId: adminId, action: `user_${accountStatus}`, entityType: 'user', entityId: userId } });
  if (accountStatus === 'suspended') {
    await createNotification(userId, { title: 'Account Suspended', message: reason || 'Your account has been suspended. Contact support for assistance.', type: 'admin' });
  }
};

export const getEmployers = async ({ page = 1, limit = 15, q, verificationStatus }) => {
  const where = {
    ...(q && { OR: [{ organizationName: { contains: q } }, { email: { contains: q } }] }),
    ...(verificationStatus && { verificationStatus }),
  };
  const [total, employers] = await Promise.all([
    prisma.organization.count({ where }),
    prisma.organization.findMany({
      where, orderBy: { createdAt: 'desc' }, skip: (page - 1) * limit, take: Number(limit),
      include: { owner: { select: { fullName: true, email: true } }, documents: true, _count: { select: { opportunities: true } } },
    }),
  ]);
  return { employers, pagination: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / limit) } };
};

export const verifyOrganization = async (adminId, orgId, verificationStatus, notes) => {
  const org = await prisma.organization.findUnique({ where: { id: orgId }, include: { owner: true } });
  if (!org) throw new AppError('Organization not found', 404);
  await prisma.organization.update({ where: { id: orgId }, data: { verificationStatus, verifiedAt: verificationStatus === 'verified' ? new Date() : null, verifiedById: adminId } });
  await prisma.activityLog.create({ data: { userId: adminId, action: `org_${verificationStatus}`, entityType: 'organization', entityId: orgId } });
  const msg = verificationStatus === 'verified'
    ? 'Your organization has been verified. You can now post opportunities.'
    : `Your organization verification was rejected. ${notes || 'Please contact support.'}`;
  await createNotification(org.ownerUserId, { title: `Organization ${verificationStatus === 'verified' ? 'Verified' : 'Rejected'}`, message: msg, type: 'verification' });
};

export const getAdminOpportunities = async ({ page = 1, limit = 15, q, status }) => {
  const where = {
    ...(q && { OR: [{ title: { contains: q } }, { organization: { organizationName: { contains: q } } }] }),
    ...(status && { status }),
  };
  const [total, opportunities] = await Promise.all([
    prisma.opportunity.count({ where }),
    prisma.opportunity.findMany({
      where, orderBy: { createdAt: 'desc' }, skip: (page - 1) * limit, take: Number(limit),
      include: { organization: { select: { organizationName: true } }, category: true, _count: { select: { applications: true } } },
    }),
  ]);
  return { opportunities, pagination: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / limit) } };
};

export const moderateOpportunity = async (adminId, oppId, action, reason) => {
  const opp = await prisma.opportunity.findUnique({ where: { id: oppId }, include: { organization: true } });
  if (!opp) throw new AppError('Opportunity not found', 404);
  const statusMap = { approve: 'published', reject: 'rejected', close: 'closed' };
  const newStatus = statusMap[action];
  if (!newStatus) throw new AppError('Invalid action', 400);
  await prisma.opportunity.update({ where: { id: oppId }, data: { status: newStatus, approvedById: action === 'approve' ? adminId : undefined, approvedAt: action === 'approve' ? new Date() : undefined, publishedAt: action === 'approve' ? new Date() : undefined } });
  await prisma.activityLog.create({ data: { userId: adminId, action: `opportunity_${action}d`, entityType: 'opportunity', entityId: oppId } });
  const msg = action === 'approve' ? `Your opportunity "${opp.title}" has been approved and is now live.` : `Your opportunity "${opp.title}" was ${action}ed. ${reason || ''}`;
  await createNotification(opp.organization.ownerUserId, { title: `Opportunity ${action === 'approve' ? 'Approved' : 'Rejected'}`, message: msg, type: 'opportunity' });
};

export const getCategories = async () => prisma.category.findMany({ orderBy: { categoryName: 'asc' }, include: { _count: { select: { opportunities: true } } } });
export const createCategory = async (data) => prisma.category.create({ data });
export const updateCategory = async (id, data) => prisma.category.update({ where: { id }, data });
export const deleteCategory = async (id) => {
  const count = await prisma.opportunity.count({ where: { categoryId: id } });
  if (count > 0) throw new AppError('Cannot delete category with existing opportunities', 400);
  await prisma.category.delete({ where: { id } });
};

export const getActivityLogs = async ({ page = 1, limit = 20, userId, action }) => {
  const where = { ...(userId && { userId }), ...(action && { action: { contains: action } }) };
  const [total, logs] = await Promise.all([
    prisma.activityLog.count({ where }),
    prisma.activityLog.findMany({ where, orderBy: { createdAt: 'desc' }, skip: (page - 1) * limit, take: Number(limit), include: { user: { select: { fullName: true, email: true, role: true } } } }),
  ]);
  return { logs, pagination: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / limit) } };
};

export const getAnalytics = async () => {
  const now = new Date();
  const months = Array.from({ length: 6 }, (_, i) => { const d = new Date(now); d.setMonth(d.getMonth() - i); return d; }).reverse();

  const monthlyData = await Promise.all(months.map(async (d) => {
    const start = new Date(d.getFullYear(), d.getMonth(), 1);
    const end = new Date(d.getFullYear(), d.getMonth() + 1, 0);
    const [users, opps, apps] = await Promise.all([
      prisma.user.count({ where: { createdAt: { gte: start, lte: end } } }),
      prisma.opportunity.count({ where: { createdAt: { gte: start, lte: end } } }),
      prisma.application.count({ where: { submittedAt: { gte: start, lte: end } } }),
    ]);
    return { month: d.toLocaleString('default', { month: 'short' }), users, opportunities: opps, applications: apps };
  }));

  const [byCategory, byStatus] = await Promise.all([
    prisma.opportunity.groupBy({ by: ['categoryId'], _count: true, where: { status: 'published' } }),
    prisma.application.groupBy({ by: ['applicationStatus'], _count: true }),
  ]);

  return { monthlyData, byCategory, byStatus };
};

export const createAdminUser = async (superAdminId, { fullName, email, password, permissions }) => {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new AppError('Email already registered', 409);
  const passwordHash = await hashPassword(password);
  const admin = await prisma.user.create({ data: { fullName, email, passwordHash, role: 'admin', emailVerifiedAt: new Date() } });
  for (const perm of permissions) {
    await prisma.adminPermission.create({ data: { adminUserId: admin.id, permissionName: perm } });
  }
  await prisma.activityLog.create({ data: { userId: superAdminId, action: 'admin_created', entityType: 'user', entityId: admin.id } });
  return admin;
};
