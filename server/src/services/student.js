import prisma from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';

// ── Profile completion calculator ────────────────────────────────────────────
const calcCompletion = (profile, user, counts) => {
  let score = 0;
  if (user.profilePhoto) score += 10;
  if (profile?.headline) score += 10;
  if (profile?.biography) score += 10;
  if (profile?.location) score += 5;
  if (profile?.linkedinUrl) score += 5;
  if (counts.education > 0) score += 20;
  if (counts.experience > 0) score += 15;
  if (counts.skills > 0) score += 15;
  if (counts.cvs > 0) score += 10;
  return Math.min(score, 100);
};

// ── Profile ───────────────────────────────────────────────────────────────────
export const getProfile = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      studentProfile: true,
      education: { orderBy: { startDate: 'desc' } },
      workExperience: { orderBy: { startDate: 'desc' } },
      userSkills: { include: { skill: true } },
      certifications: { orderBy: { issueDate: 'desc' } },
      cvs: { orderBy: { uploadedAt: 'desc' } },
    },
  });
  if (!user) throw new AppError('User not found', 404);
  const { passwordHash, ...safeUser } = user;
  return safeUser;
};

export const updateProfile = async (userId, data) => {
  const { headline, biography, dateOfBirth, gender, location, linkedinUrl, githubUrl, portfolioUrl, fullName, phone } = data;

  await prisma.user.update({ where: { id: userId }, data: { fullName, phone } });

  const profile = await prisma.studentProfile.upsert({
    where: { userId },
    update: { headline, biography, dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined, gender, location, linkedinUrl, githubUrl, portfolioUrl },
    create: { userId, headline, biography, dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined, gender, location, linkedinUrl, githubUrl, portfolioUrl },
  });

  await _updateCompletion(userId);
  return profile;
};

export const getEducation = async (userId) => {
  return prisma.education.findMany({ where: { userId }, orderBy: { startDate: 'desc' } });
};

export const getExperience = async (userId) => {
  return prisma.workExperience.findMany({ where: { userId }, orderBy: { startDate: 'desc' } });
};

export const getCertifications = async (userId) => {
  return prisma.certification.findMany({ where: { userId }, orderBy: { issueDate: 'desc' } });
};

export const getCVs = async (userId) => {
  return prisma.cV.findMany({ where: { userId }, orderBy: { uploadedAt: 'desc' } });
};

export const updateProfilePhoto = async (userId, filePath) => {
  await prisma.user.update({ where: { id: userId }, data: { profilePhoto: filePath } });
  await _updateCompletion(userId);
  return filePath;
};

const _updateCompletion = async (userId) => {
  const [user, edu, exp, skills, cvs] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId }, include: { studentProfile: true } }),
    prisma.education.count({ where: { userId } }),
    prisma.workExperience.count({ where: { userId } }),
    prisma.userSkill.count({ where: { userId } }),
    prisma.cV.count({ where: { userId } }),
  ]);
  const completion = calcCompletion(user.studentProfile, user, { education: edu, experience: exp, skills, cvs });
  await prisma.studentProfile.update({ where: { userId }, data: { profileCompletion: completion } });
  return completion;
};

// ── Education ─────────────────────────────────────────────────────────────────
export const addEducation = async (userId, data) => {
  const edu = await prisma.education.create({
    data: { userId, ...data, startDate: new Date(data.startDate), endDate: data.endDate ? new Date(data.endDate) : null },
  });
  await _updateCompletion(userId);
  return edu;
};

export const updateEducation = async (userId, id, data) => {
  const edu = await prisma.education.findFirst({ where: { id, userId } });
  if (!edu) throw new AppError('Education record not found', 404);
  return prisma.education.update({
    where: { id },
    data: { ...data, startDate: new Date(data.startDate), endDate: data.endDate ? new Date(data.endDate) : null },
  });
};

export const deleteEducation = async (userId, id) => {
  const edu = await prisma.education.findFirst({ where: { id, userId } });
  if (!edu) throw new AppError('Education record not found', 404);
  await prisma.education.delete({ where: { id } });
  await _updateCompletion(userId);
};

// ── Work Experience ───────────────────────────────────────────────────────────
export const addExperience = async (userId, data) => {
  const exp = await prisma.workExperience.create({
    data: { userId, ...data, startDate: new Date(data.startDate), endDate: data.endDate ? new Date(data.endDate) : null },
  });
  await _updateCompletion(userId);
  return exp;
};

export const updateExperience = async (userId, id, data) => {
  const exp = await prisma.workExperience.findFirst({ where: { id, userId } });
  if (!exp) throw new AppError('Experience record not found', 404);
  return prisma.workExperience.update({
    where: { id },
    data: { ...data, startDate: new Date(data.startDate), endDate: data.endDate ? new Date(data.endDate) : null },
  });
};

export const deleteExperience = async (userId, id) => {
  const exp = await prisma.workExperience.findFirst({ where: { id, userId } });
  if (!exp) throw new AppError('Experience record not found', 404);
  await prisma.workExperience.delete({ where: { id } });
};

// ── Skills ────────────────────────────────────────────────────────────────────
export const getSkills = async () => prisma.skill.findMany({ orderBy: { skillName: 'asc' } });

export const addSkill = async (userId, skillName, proficiencyLevel) => {
  let skill = await prisma.skill.findUnique({ where: { skillName } });
  if (!skill) skill = await prisma.skill.create({ data: { skillName } });

  const existing = await prisma.userSkill.findUnique({ where: { userId_skillId: { userId, skillId: skill.id } } });
  if (existing) throw new AppError('Skill already added', 409);

  const userSkill = await prisma.userSkill.create({
    data: { userId, skillId: skill.id, proficiencyLevel: proficiencyLevel || 'intermediate' },
    include: { skill: true },
  });
  await _updateCompletion(userId);
  return userSkill;
};

export const updateSkill = async (userId, id, proficiencyLevel) => {
  const us = await prisma.userSkill.findFirst({ where: { id, userId } });
  if (!us) throw new AppError('Skill not found', 404);
  return prisma.userSkill.update({ where: { id }, data: { proficiencyLevel }, include: { skill: true } });
};

export const deleteSkill = async (userId, id) => {
  const us = await prisma.userSkill.findFirst({ where: { id, userId } });
  if (!us) throw new AppError('Skill not found', 404);
  await prisma.userSkill.delete({ where: { id } });
};

// ── Certifications ────────────────────────────────────────────────────────────
export const addCertification = async (userId, data) => {
  return prisma.certification.create({
    data: { userId, ...data, issueDate: new Date(data.issueDate), expiryDate: data.expiryDate ? new Date(data.expiryDate) : null },
  });
};

export const updateCertification = async (userId, id, data) => {
  const cert = await prisma.certification.findFirst({ where: { id, userId } });
  if (!cert) throw new AppError('Certification not found', 404);
  return prisma.certification.update({
    where: { id },
    data: { ...data, issueDate: new Date(data.issueDate), expiryDate: data.expiryDate ? new Date(data.expiryDate) : null },
  });
};

export const deleteCertification = async (userId, id) => {
  const cert = await prisma.certification.findFirst({ where: { id, userId } });
  if (!cert) throw new AppError('Certification not found', 404);
  await prisma.certification.delete({ where: { id } });
};

// ── CVs ───────────────────────────────────────────────────────────────────────
export const uploadCV = async (userId, fileName, filePath) => {
  const count = await prisma.cV.count({ where: { userId } });
  if (count >= 5) throw new AppError('Maximum 5 CVs allowed. Delete one first.', 400);

  const isDefault = count === 0;
  const cv = await prisma.cV.create({ data: { userId, fileName, filePath, isDefault } });
  await _updateCompletion(userId);
  return cv;
};

export const deleteCV = async (userId, id) => {
  const cv = await prisma.cV.findFirst({ where: { id, userId } });
  if (!cv) throw new AppError('CV not found', 404);
  await prisma.cV.delete({ where: { id } });

  // If deleted CV was default, set another as default
  if (cv.isDefault) {
    const next = await prisma.cV.findFirst({ where: { userId } });
    if (next) await prisma.cV.update({ where: { id: next.id }, data: { isDefault: true } });
  }
  await _updateCompletion(userId);
};

export const setDefaultCV = async (userId, id) => {
  const cv = await prisma.cV.findFirst({ where: { id, userId } });
  if (!cv) throw new AppError('CV not found', 404);
  await prisma.cV.updateMany({ where: { userId }, data: { isDefault: false } });
  return prisma.cV.update({ where: { id }, data: { isDefault: true } });
};

// ── Dashboard ─────────────────────────────────────────────────────────────────
export const getDashboard = async (userId) => {
  const [user, appStats, saved, recentApps, recentOpps] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      include: { studentProfile: true, cvs: { where: { isDefault: true }, take: 1 } },
    }),
    prisma.application.groupBy({
      by: ['applicationStatus'],
      where: { applicantId: userId },
      _count: true,
    }),
    prisma.savedOpportunity.count({ where: { userId } }),
    prisma.application.findMany({
      where: { applicantId: userId },
      orderBy: { submittedAt: 'desc' },
      take: 5,
      include: { opportunity: { include: { organization: { select: { organizationName: true, logo: true } } } } },
    }),
    prisma.opportunity.findMany({
      where: { status: 'published', applicationDeadline: { gte: new Date() } },
      orderBy: { publishedAt: 'desc' },
      take: 6,
      include: { organization: { select: { organizationName: true, logo: true } }, category: true },
    }),
  ]);

  const stats = { submitted: 0, under_review: 0, shortlisted: 0, accepted: 0, rejected: 0, withdrawn: 0 };
  appStats.forEach((s) => { stats[s.applicationStatus] = s._count; });

  return {
    user: { id: user.id, fullName: user.fullName, profilePhoto: user.profilePhoto, role: user.role },
    profile: user.studentProfile,
    hasDefaultCV: user.cvs.length > 0,
    stats: { ...stats, saved },
    recentApplications: recentApps,
    recentOpportunities: recentOpps,
  };
};
