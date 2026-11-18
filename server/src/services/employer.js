import prisma from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';
import { createNotification } from './notification.js';

export const getOrCreateOrg = async (userId) => {
  return prisma.organization.findUnique({ where: { ownerUserId: userId } });
};

export const createOrUpdateOrg = async (userId, data) => {
  const { organizationName, organizationType, industry, description, website, email, phone, location } = data;
  return prisma.organization.upsert({
    where: { ownerUserId: userId },
    update: { organizationName, organizationType, industry, description, website, email, phone, location },
    create: { ownerUserId: userId, organizationName, organizationType, industry, description, website, email: email || '', phone, location: location || '' },
  });
};

export const updateLogo = async (userId, logo) => {
  const org = await prisma.organization.findUnique({ where: { ownerUserId: userId } });
  if (!org) throw new AppError('Organization not found', 404);
  return prisma.organization.update({ where: { ownerUserId: userId }, data: { logo } });
};

export const submitVerificationDoc = async (userId, documentType, filePath) => {
  const org = await prisma.organization.findUnique({ where: { ownerUserId: userId } });
  if (!org) throw new AppError('Create an organization profile first', 400);
  return prisma.organizationDocument.create({ data: { organizationId: org.id, documentType, filePath } });
};

export const getEmployerDashboard = async (userId) => {
  const org = await prisma.organization.findUnique({ where: { ownerUserId: userId } });
  if (!org) return { org: null, stats: {}, recentApplications: [], opportunities: [] };

  const [totalOpps, activeOpps, totalApps, newApps, shortlisted, recentApps, recentOpps] = await Promise.all([
    prisma.opportunity.count({ where: { organizationId: org.id } }),
    prisma.opportunity.count({ where: { organizationId: org.id, status: 'published' } }),
    prisma.application.count({ where: { opportunity: { organizationId: org.id } } }),
    prisma.application.count({ where: { opportunity: { organizationId: org.id }, applicationStatus: 'submitted' } }),
    prisma.application.count({ where: { opportunity: { organizationId: org.id }, applicationStatus: 'shortlisted' } }),
    prisma.application.findMany({
      where: { opportunity: { organizationId: org.id } },
      orderBy: { submittedAt: 'desc' }, take: 5,
      include: {
        applicant: { select: { fullName: true, profilePhoto: true, email: true } },
        opportunity: { select: { title: true } },
      },
    }),
    prisma.opportunity.findMany({
      where: { organizationId: org.id }, orderBy: { createdAt: 'desc' }, take: 5,
      include: { _count: { select: { applications: true } }, category: true },
    }),
  ]);

  return {
    org,
    stats: { totalOpps, activeOpps, totalApps, newApps, shortlisted },
    recentApplications: recentApps,
    recentOpportunities: recentOpps,
  };
};

// Saved opportunities (for students)
export const saveOpportunity = async (userId, opportunityId) => {
  const opp = await prisma.opportunity.findFirst({ where: { id: opportunityId, status: 'published' } });
  if (!opp) throw new AppError('Opportunity not found', 404);
  const existing = await prisma.savedOpportunity.findUnique({ where: { userId_opportunityId: { userId, opportunityId } } });
  if (existing) throw new AppError('Already saved', 409);
  return prisma.savedOpportunity.create({ data: { userId, opportunityId } });
};

export const unsaveOpportunity = async (userId, opportunityId) => {
  await prisma.savedOpportunity.deleteMany({ where: { userId, opportunityId } });
};

export const getSavedOpportunities = async (userId, { page = 1, limit = 10 }) => {
  const where = { userId };
  const [total, saved] = await Promise.all([
    prisma.savedOpportunity.count({ where }),
    prisma.savedOpportunity.findMany({
      where, orderBy: { savedAt: 'desc' }, skip: (page - 1) * limit, take: Number(limit),
      include: { opportunity: { include: { organization: { select: { organizationName: true, logo: true } }, category: true, _count: { select: { applications: true } } } } },
    }),
  ]);
  return { saved, pagination: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / limit) } };
};

export const checkSaved = async (userId, opportunityId) => {
  const s = await prisma.savedOpportunity.findUnique({ where: { userId_opportunityId: { userId, opportunityId } } });
  return { isSaved: !!s };
};
