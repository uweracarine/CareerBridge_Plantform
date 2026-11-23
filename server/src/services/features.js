import prisma from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';

export const getJobAlerts = (userId) => prisma.jobAlert.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });

export const createJobAlert = (userId, data) => prisma.jobAlert.create({
  data: {
    userId,
    keywords: data.keywords || null,
    categoryId: data.categoryId || null,
    location: data.location || null,
    employmentType: data.employmentType || null,
    workArrangement: data.workArrangement || null,
    frequency: data.frequency || 'daily',
  },
});

export const updateJobAlert = async (userId, id, data) => {
  const alert = await prisma.jobAlert.findFirst({ where: { id, userId } });
  if (!alert) throw new AppError('Job alert not found', 404);
  return prisma.jobAlert.update({ where: { id }, data });
};

export const deleteJobAlert = async (userId, id) => {
  const alert = await prisma.jobAlert.findFirst({ where: { id, userId } });
  if (!alert) throw new AppError('Job alert not found', 404);
  await prisma.jobAlert.delete({ where: { id } });
};

export const getRecommendations = async (userId) => {
  const [skills, profile, applications] = await Promise.all([
    prisma.userSkill.findMany({ where: { userId }, include: { skill: true } }),
    prisma.studentProfile.findUnique({ where: { userId } }),
    prisma.application.findMany({ where: { applicantId: userId }, select: { opportunityId: true } }),
  ]);
  const names = skills.map((item) => item.skill.skillName.toLowerCase());
  const appliedIds = applications.map((item) => item.opportunityId);
  const opportunities = await prisma.opportunity.findMany({
    where: { status: 'published', applicationDeadline: { gte: new Date() }, id: { notIn: appliedIds } },
    include: { organization: { select: { organizationName: true, logo: true, location: true } }, category: true },
    take: 30,
  });
  return opportunities.map((opportunity) => {
    const text = `${opportunity.title} ${opportunity.requiredSkills || ''} ${opportunity.category.categoryName}`.toLowerCase();
    const matches = names.filter((name) => text.includes(name));
    const skillScore = names.length ? Math.round((matches.length / names.length) * 70) : 20;
    const locationScore = profile?.location && opportunity.location.toLowerCase().includes(profile.location.toLowerCase()) ? 20 : 0;
    const match = Math.min(100, 10 + skillScore + locationScore);
    return { ...opportunity, matchPercentage: match, matchedSkills: matches };
  }).sort((a, b) => b.matchPercentage - a.matchPercentage).slice(0, 12);
};

export const scheduleInterview = async (organizationId, changedById, applicationId, data) => {
  const application = await prisma.application.findFirst({
    where: { id: applicationId, opportunity: { organizationId } },
    include: { applicant: { select: { id: true } } },
  });
  if (!application) throw new AppError('Application not found', 404);
  const interview = await prisma.interview.create({
    data: {
      applicationId,
      organizationId,
      applicantId: application.applicantId,
      scheduledAt: new Date(data.scheduledAt),
      durationMinutes: Number(data.durationMinutes || 60),
      meetingLink: data.meetingLink || null,
      location: data.location || null,
      notes: data.notes || null,
    },
  });
  await prisma.application.update({ where: { id: applicationId }, data: { applicationStatus: 'interview_scheduled' } });
  await prisma.applicationStatusHistory.create({
    data: { applicationId, oldStatus: application.applicationStatus, newStatus: 'interview_scheduled', changedById, notes: data.notes || 'Interview scheduled' },
  });
  await prisma.notification.create({
    data: { userId: application.applicantId, title: 'Interview scheduled', message: `Your interview is scheduled for ${new Date(data.scheduledAt).toLocaleString()}.`, notificationType: 'application' },
  });
  return interview;
};

export const getInterviewsForOrganization = (organizationId) => prisma.interview.findMany({
  where: { organizationId }, orderBy: { scheduledAt: 'asc' }, include: { application: { include: { applicant: { select: { fullName: true, email: true } }, opportunity: { select: { title: true } } } } },
});

export const getInterviewsForStudent = (userId) => prisma.interview.findMany({
  where: { applicantId: userId }, orderBy: { scheduledAt: 'asc' }, include: { organization: { select: { organizationName: true, logo: true } }, application: { include: { opportunity: { select: { title: true } } } } },
});

export const updateInterviewStatus = async (organizationId, id, status) => {
  const interview = await prisma.interview.findFirst({ where: { id, organizationId } });
  if (!interview) throw new AppError('Interview not found', 404);
  return prisma.interview.update({ where: { id }, data: { status } });
};

export const reportOpportunity = async (userId, opportunityId, data) => {
  const opportunity = await prisma.opportunity.findUnique({ where: { id: opportunityId } });
  if (!opportunity) throw new AppError('Opportunity not found', 404);
  return prisma.report.create({ data: { reportedById: userId, opportunityId, reason: data.reason, description: data.description } });
};
