import prisma from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';
import { createNotification } from './notification.js';

export const submitApplication = async (applicantId, { opportunityId, cvId, coverLetter }) => {
  const opp = await prisma.opportunity.findFirst({
    where: { id: opportunityId, status: 'published' },
    include: { organization: { select: { id: true, organizationName: true, ownerUserId: true } } },
  });
  if (!opp) throw new AppError('Opportunity not found or no longer accepting applications', 404);
  if (new Date(opp.applicationDeadline) < new Date()) throw new AppError('Application deadline has passed', 400);

  const cv = await prisma.cV.findFirst({ where: { id: cvId, userId: applicantId } });
  if (!cv) throw new AppError('CV not found', 404);

  const existing = await prisma.application.findUnique({ where: { opportunityId_applicantId: { opportunityId, applicantId } } });
  if (existing) throw new AppError('You have already applied for this opportunity', 409);

  const openingMessage = coverLetter?.trim()
    ? `Application submitted for "${opp.title}".\n\n${coverLetter.trim()}`
    : `Hello, I have submitted my application for "${opp.title}" and would be happy to discuss my suitability for the role.`;

  // Applying opens the one employer/applicant thread for this opportunity. This
  // guarantees that an employer can reply to the candidate from the application.
  const { application, conversation } = await prisma.$transaction(async (tx) => {
    const createdApplication = await tx.application.create({
      data: { opportunityId, applicantId, cvId, coverLetter, applicationStatus: 'submitted' },
      include: { opportunity: { include: { organization: { select: { organizationName: true } } } } },
    });

    await tx.applicationStatusHistory.create({
      data: { applicationId: createdApplication.id, oldStatus: 'submitted', newStatus: 'submitted', changedById: applicantId, notes: 'Application submitted' },
    });

    const createdConversation = await tx.conversation.upsert({
      where: { opportunityId_employerId_applicantId: { opportunityId, employerId: opp.organization.id, applicantId } },
      update: {},
      create: { opportunityId, employerId: opp.organization.id, applicantId },
    });

    await tx.message.create({ data: { conversationId: createdConversation.id, senderId: applicantId, message: openingMessage } });

    await tx.notification.createMany({
      data: [
        {
          userId: applicantId,
          title: 'Application submitted',
          message: `Your application for "${opp.title}" at ${opp.organization.organizationName} has been submitted.`,
          notificationType: 'application',
        },
        {
          userId: opp.organization.ownerUserId,
          title: 'New application and message',
          message: `A job seeker applied for "${opp.title}" and started a conversation with your organization.`,
          notificationType: 'application',
        },
      ],
    });

    return { application: createdApplication, conversation: createdConversation };
  });

  await prisma.activityLog.create({ data: { userId: applicantId, action: 'application_submitted', entityType: 'application', entityId: application.id } });
  return { ...application, conversationId: conversation.id };
};

export const getMyApplications = async (applicantId, { page = 1, limit = 10, status }) => {
  const where = { applicantId, ...(status && { applicationStatus: status }) };
  const [total, applications] = await Promise.all([
    prisma.application.count({ where }),
    prisma.application.findMany({
      where, orderBy: { submittedAt: 'desc' }, skip: (page - 1) * limit, take: Number(limit),
      include: {
        opportunity: { include: { organization: { select: { organizationName: true, logo: true } }, category: true } },
        cv: { select: { fileName: true } },
      },
    }),
  ]);
  return { applications, pagination: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / limit) } };
};

export const getApplicationById = async (applicantId, id) => {
  const app = await prisma.application.findFirst({
    where: { id, applicantId },
    include: {
      opportunity: { include: { organization: { select: { organizationName: true, logo: true, location: true } }, category: true } },
      cv: true,
      documents: true,
      statusHistory: { orderBy: { changedAt: 'asc' }, include: { changedBy: { select: { fullName: true, role: true } } } },
    },
  });
  if (!app) throw new AppError('Application not found', 404);
  return app;
};

export const withdrawApplication = async (applicantId, id) => {
  const app = await prisma.application.findFirst({ where: { id, applicantId } });
  if (!app) throw new AppError('Application not found', 404);
  if (['accepted', 'rejected', 'withdrawn'].includes(app.applicationStatus)) throw new AppError('Cannot withdraw this application', 400);

  await prisma.application.update({ where: { id }, data: { applicationStatus: 'withdrawn' } });
  await prisma.applicationStatusHistory.create({
    data: { applicationId: id, oldStatus: app.applicationStatus, newStatus: 'withdrawn', changedById: applicantId, notes: 'Withdrawn by applicant' },
  });
};

export const addApplicationDocument = async (applicantId, applicationId, documentName, filePath) => {
  const app = await prisma.application.findFirst({ where: { id: applicationId, applicantId } });
  if (!app) throw new AppError('Application not found', 404);
  return prisma.applicationDocument.create({ data: { applicationId, documentName, filePath } });
};

// Employer: get applications for their opportunities
export const getEmployerApplications = async (organizationId, { opportunityId, status, page = 1, limit = 10 }) => {
  const where = {
    opportunity: { organizationId },
    ...(opportunityId && { opportunityId }),
    ...(status && { applicationStatus: status }),
  };
  const [total, applications] = await Promise.all([
    prisma.application.count({ where }),
    prisma.application.findMany({
      where, orderBy: { submittedAt: 'desc' }, skip: (page - 1) * limit, take: Number(limit),
      include: {
        applicant: { select: { id: true, fullName: true, email: true, profilePhoto: true }, include: { studentProfile: { select: { headline: true, location: true } } } },
        opportunity: { select: { id: true, title: true } },
        cv: { select: { id: true, fileName: true, filePath: true } },
      },
    }),
  ]);
  return { applications, pagination: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / limit) } };
};

export const getEmployerApplicationById = async (organizationId, id) => {
  const app = await prisma.application.findFirst({
    where: { id, opportunity: { organizationId } },
    include: {
      applicant: {
        select: { id: true, fullName: true, email: true, phone: true, profilePhoto: true },
        include: {
          studentProfile: true,
          education: { orderBy: { startDate: 'desc' } },
          workExperience: { orderBy: { startDate: 'desc' } },
          userSkills: { include: { skill: true } },
          certifications: true,
        },
      },
      opportunity: { select: { id: true, title: true, organizationId: true } },
      cv: true,
      documents: true,
      statusHistory: { orderBy: { changedAt: 'asc' }, include: { changedBy: { select: { fullName: true } } } },
    },
  });
  if (!app) throw new AppError('Application not found', 404);
  return app;
};

export const updateApplicationStatus = async (organizationId, id, newStatus, notes, changedById) => {
  const app = await prisma.application.findFirst({ where: { id, opportunity: { organizationId } } });
  if (!app) throw new AppError('Application not found', 404);

  const updated = await prisma.application.update({ where: { id }, data: { applicationStatus: newStatus } });
  await prisma.applicationStatusHistory.create({
    data: { applicationId: id, oldStatus: app.applicationStatus, newStatus, changedById, notes: notes || null },
  });

  const statusMessages = {
    shortlisted: 'Congratulations! You have been shortlisted.',
    interview_scheduled: 'An interview has been scheduled for your application.',
    accepted: 'Congratulations! Your application has been accepted.',
    rejected: 'Your application status has been updated.',
    under_review: 'Your application is now under review.',
  };

  if (statusMessages[newStatus]) {
    await createNotification(app.applicantId, {
      title: 'Application Update',
      message: `${statusMessages[newStatus]} Check your application for details.`,
      type: 'application',
    });
  }
  return updated;
};
