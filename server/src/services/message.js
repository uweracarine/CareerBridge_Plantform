import prisma from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';
import { createNotification } from './notification.js';

export const getConversations = async (userId) => {
  const user = await prisma.user.findUnique({ where: { id: userId }, include: { organization: true } });
  if (!user) throw new AppError('User not found', 404);
  const isEmployer = user.role === 'employer';

  const where = isEmployer
    ? { employer: { ownerUserId: userId } }
    : { applicantId: userId };

  return prisma.conversation.findMany({
    where, orderBy: { createdAt: 'desc' },
    include: {
      opportunity: { select: { title: true } },
      employer: { select: { organizationName: true, logo: true } },
      applicant: { select: { fullName: true, profilePhoto: true } },
      messages: { orderBy: { createdAt: 'desc' }, take: 1 },
    },
  });
};

export const getOrCreateConversation = async (userId, opportunityId, applicantId) => {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
  if (!user) throw new AppError('User not found', 404);

  const opp = await prisma.opportunity.findUnique({ where: { id: opportunityId }, include: { organization: true } });
  if (!opp) throw new AppError('Opportunity not found', 404);

  let candidateId = userId;
  if (user.role === 'employer') {
    if (opp.organization.ownerUserId !== userId) throw new AppError('Opportunity not found or access denied', 404);
    if (!applicantId) throw new AppError('Applicant is required to start this conversation', 400);
    const application = await prisma.application.findUnique({ where: { opportunityId_applicantId: { opportunityId, applicantId } } });
    if (!application) throw new AppError('A conversation can only be started with an applicant', 400);
    candidateId = applicantId;
  } else if (!['student', 'graduate', 'job_seeker'].includes(user.role)) {
    throw new AppError('Only job seekers and employers can use messages', 403);
  }

  const existing = await prisma.conversation.findUnique({
    where: { opportunityId_employerId_applicantId: { opportunityId, employerId: opp.organizationId, applicantId: candidateId } },
  });
  if (existing) return existing;

  return prisma.conversation.create({ data: { opportunityId, employerId: opp.organizationId, applicantId: candidateId } });
};

export const getMessages = async (userId, conversationId) => {
  const conv = await prisma.conversation.findFirst({
    where: { id: conversationId, OR: [{ applicantId: userId }, { employer: { ownerUserId: userId } }] },
  });
  if (!conv) throw new AppError('Conversation not found', 404);

  // Mark messages as read
  await prisma.message.updateMany({ where: { conversationId, senderId: { not: userId }, readAt: null }, data: { readAt: new Date() } });

  return prisma.message.findMany({ where: { conversationId }, orderBy: { createdAt: 'asc' }, include: { sender: { select: { fullName: true, profilePhoto: true, role: true } } } });
};

export const sendMessage = async (senderId, conversationId, message) => {
  const conv = await prisma.conversation.findFirst({
    where: { id: conversationId, OR: [{ applicantId: senderId }, { employer: { ownerUserId: senderId } }] },
    include: {
      employer: { select: { ownerUserId: true, organizationName: true } },
      applicant: { select: { fullName: true } },
      opportunity: { select: { title: true } },
    },
  });
  if (!conv) throw new AppError('Conversation not found or access denied', 404);
  const cleanedMessage = message?.trim();
  if (!cleanedMessage) throw new AppError('A message cannot be empty', 400);
  if (cleanedMessage.length > 2000) throw new AppError('A message cannot exceed 2,000 characters', 400);

  const sent = await prisma.message.create({ data: { conversationId, senderId, message: cleanedMessage }, include: { sender: { select: { fullName: true, profilePhoto: true } } } });
  const recipientId = senderId === conv.applicantId ? conv.employer.ownerUserId : conv.applicantId;
  const senderLabel = senderId === conv.applicantId ? conv.applicant.fullName : conv.employer.organizationName;
  await createNotification(recipientId, {
    title: 'New message',
    message: `You have a new message from ${senderLabel} about "${conv.opportunity.title}".`,
    type: 'message',
  });
  return sent;
};

export const markConversationAsRead = async (userId, conversationId) => {
  const conv = await prisma.conversation.findFirst({
    where: { id: conversationId, OR: [{ applicantId: userId }, { employer: { ownerUserId: userId } }] },
  });
  if (!conv) throw new AppError('Conversation not found or access denied', 404);

  await prisma.message.updateMany({
    where: { conversationId, senderId: { not: userId }, readAt: null },
    data: { readAt: new Date() },
  });

  return prisma.message.findMany({
    where: { conversationId },
    orderBy: { createdAt: 'asc' },
    include: { sender: { select: { fullName: true, profilePhoto: true, role: true } } },
  });
};

export const getUnreadCount = async (userId) => {
  return prisma.message.count({ where: { conversation: { OR: [{ applicantId: userId }, { employer: { ownerUserId: userId } }] }, senderId: { not: userId }, readAt: null } });
};
