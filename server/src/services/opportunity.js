import prisma from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';
import { generateUniqueSlug } from '../utils/slug.js';

const oppInclude = {
  organization: { select: { id: true, organizationName: true, logo: true, location: true, verificationStatus: true } },
  category: { select: { id: true, categoryName: true } },
  _count: { select: { applications: true, savedBy: true } },
};

export const getOpportunities = async ({ q, category, employmentType, workArrangement, location, status = 'published', page = 1, limit = 12, sort = 'newest' }) => {
  const where = { status };
  if (q) {
    where.OR = [
      { title: { contains: q } },
      { description: { contains: q } },
      { requiredSkills: { contains: q } },
      { organization: { organizationName: { contains: q } } },
    ];
  }
  if (category) where.category = { categoryName: { contains: category } };
  if (employmentType) where.employmentType = employmentType;
  if (workArrangement) where.workArrangement = workArrangement;
  if (location) where.location = { contains: location };

  const orderBy = {
    newest: { publishedAt: 'desc' },
    deadline: { applicationDeadline: 'asc' },
    oldest: { publishedAt: 'asc' },
  }[sort] || { publishedAt: 'desc' };

  const skip = (Number(page) - 1) * Number(limit);
  const [total, opportunities] = await Promise.all([
    prisma.opportunity.count({ where }),
    prisma.opportunity.findMany({ where, include: oppInclude, orderBy, skip, take: Number(limit) }),
  ]);

  return { opportunities, pagination: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / limit) } };
};

export const getOpportunityById = async (id) => {
  const opp = await prisma.opportunity.findFirst({
    where: { OR: [{ id }, { slug: id }], status: 'published' },
    include: { ...oppInclude, approvedBy: { select: { fullName: true } } },
  });
  if (!opp) throw new AppError('Opportunity not found', 404);
  return opp;
};

export const getFeatured = async () => {
  return prisma.opportunity.findMany({
    where: { status: 'published', applicationDeadline: { gte: new Date() } },
    include: oppInclude,
    orderBy: { publishedAt: 'desc' },
    take: 6,
  });
};

export const getCategories = async () => {
  return prisma.category.findMany({
    orderBy: { categoryName: 'asc' },
    include: { _count: { select: { opportunities: { where: { status: 'published' } } } } },
  });
};

export const createOpportunity = async (organizationId, data) => {
  const slug = await generateUniqueSlug(data.title, prisma, 'opportunity');
  return prisma.opportunity.create({
    // Only verified organizations reach this service (see the withOrg middleware),
    // so a newly posted role can be discovered and applied to immediately.
    data: { ...data, organizationId, slug, status: 'published', publishedAt: new Date(), salaryMin: data.salaryMin ? Number(data.salaryMin) : null, salaryMax: data.salaryMax ? Number(data.salaryMax) : null, applicationDeadline: new Date(data.applicationDeadline) },
    include: oppInclude,
  });
};

export const updateOpportunity = async (organizationId, id, data) => {
  const opp = await prisma.opportunity.findFirst({ where: { id, organizationId } });
  if (!opp) throw new AppError('Opportunity not found or access denied', 404);
  if (opp.status === 'published') throw new AppError('Cannot edit a published opportunity. Close it first.', 400);
  return prisma.opportunity.update({
    where: { id },
    data: { ...data, salaryMin: data.salaryMin ? Number(data.salaryMin) : null, salaryMax: data.salaryMax ? Number(data.salaryMax) : null, applicationDeadline: data.applicationDeadline ? new Date(data.applicationDeadline) : undefined },
    include: oppInclude,
  });
};

export const deleteOpportunity = async (organizationId, id) => {
  const opp = await prisma.opportunity.findFirst({ where: { id, organizationId } });
  if (!opp) throw new AppError('Opportunity not found or access denied', 404);
  if (opp.status === 'published') throw new AppError('Cannot delete a published opportunity. Close it first.', 400);
  await prisma.opportunity.delete({ where: { id } });
};

export const getEmployerOpportunities = async (organizationId, params) => {
  const { page = 1, limit = 10, status } = params;
  const where = { organizationId, ...(status && { status }) };
  const [total, opportunities] = await Promise.all([
    prisma.opportunity.count({ where }),
    prisma.opportunity.findMany({ where, include: oppInclude, orderBy: { createdAt: 'desc' }, skip: (page - 1) * limit, take: Number(limit) }),
  ]);
  return { opportunities, pagination: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / limit) } };
};
