import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // ── Categories ──────────────────────────────────────────────────────────────
  const categories = [
    { categoryName: 'Full-time Jobs', description: 'Permanent full-time employment opportunities' },
    { categoryName: 'Part-time Jobs', description: 'Part-time employment opportunities' },
    { categoryName: 'Internships', description: 'Internship and attachment programs' },
    { categoryName: 'Graduate Programs', description: 'Graduate trainee and management trainee programs' },
    { categoryName: 'Attachments', description: 'Academic attachments and industrial placements' },
    { categoryName: 'Remote Jobs', description: 'Work from home and remote opportunities' },
    { categoryName: 'Freelance', description: 'Freelance and contract-based work' },
    { categoryName: 'Training', description: 'Professional training and skills development' },
    { categoryName: 'Scholarships', description: 'Scholarship and funding opportunities' },
    { categoryName: 'Fellowships', description: 'Fellowship and research programs' },
    { categoryName: 'Apprenticeships', description: 'Apprenticeship and vocational training' },
    { categoryName: 'Volunteer', description: 'Volunteer and community service opportunities' },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { categoryName: cat.categoryName },
      update: {},
      create: cat,
    });
  }
  console.log('✓ Categories seeded');

  // ── Skills ───────────────────────────────────────────────────────────────────
  const skills = [
    // Tech
    { skillName: 'JavaScript', category: 'Technology' },
    { skillName: 'Python', category: 'Technology' },
    { skillName: 'React.js', category: 'Technology' },
    { skillName: 'Node.js', category: 'Technology' },
    { skillName: 'SQL', category: 'Technology' },
    { skillName: 'Java', category: 'Technology' },
    { skillName: 'PHP', category: 'Technology' },
    { skillName: 'Data Analysis', category: 'Technology' },
    { skillName: 'Machine Learning', category: 'Technology' },
    { skillName: 'Cybersecurity', category: 'Technology' },
    { skillName: 'Cloud Computing', category: 'Technology' },
    { skillName: 'Mobile Development', category: 'Technology' },
    // Business
    { skillName: 'Project Management', category: 'Business' },
    { skillName: 'Financial Analysis', category: 'Business' },
    { skillName: 'Marketing', category: 'Business' },
    { skillName: 'Sales', category: 'Business' },
    { skillName: 'Business Development', category: 'Business' },
    { skillName: 'Accounting', category: 'Business' },
    { skillName: 'Human Resources', category: 'Business' },
    { skillName: 'Supply Chain', category: 'Business' },
    // Soft Skills
    { skillName: 'Communication', category: 'Soft Skills' },
    { skillName: 'Leadership', category: 'Soft Skills' },
    { skillName: 'Teamwork', category: 'Soft Skills' },
    { skillName: 'Problem Solving', category: 'Soft Skills' },
    { skillName: 'Critical Thinking', category: 'Soft Skills' },
    { skillName: 'Time Management', category: 'Soft Skills' },
    { skillName: 'Adaptability', category: 'Soft Skills' },
    // Other
    { skillName: 'Research', category: 'Academic' },
    { skillName: 'Report Writing', category: 'Academic' },
    { skillName: 'Public Speaking', category: 'Communication' },
    { skillName: 'Graphic Design', category: 'Creative' },
    { skillName: 'Content Writing', category: 'Creative' },
  ];

  for (const skill of skills) {
    await prisma.skill.upsert({
      where: { skillName: skill.skillName },
      update: {},
      create: skill,
    });
  }
  console.log('✓ Skills seeded');

  // ── Admin Users ──────────────────────────────────────────────────────────────
  const adminPassword = await bcrypt.hash('Admin@123', 10);
  const superAdmin = await prisma.user.upsert({
    where: { email: 'admin@careerbridge.rw' },
    update: {},
    create: {
      fullName: 'Super Administrator',
      email: 'admin@careerbridge.rw',
      passwordHash: adminPassword,
      role: 'super_admin',
      emailVerifiedAt: new Date(),
      accountStatus: 'active',
    },
  });

  await prisma.adminPermission.upsert({
    where: { adminUserId_permissionName: { adminUserId: superAdmin.id, permissionName: 'all' } },
    update: {},
    create: { adminUserId: superAdmin.id, permissionName: 'all' },
  });

  const moderatorPassword = await bcrypt.hash('Mod@123', 10);
  const moderator = await prisma.user.upsert({
    where: { email: 'moderator@careerbridge.rw' },
    update: {},
    create: {
      fullName: 'Content Moderator',
      email: 'moderator@careerbridge.rw',
      passwordHash: moderatorPassword,
      role: 'admin',
      emailVerifiedAt: new Date(),
      accountStatus: 'active',
    },
  });

  for (const perm of ['manage_opportunities', 'manage_users', 'view_reports']) {
    await prisma.adminPermission.upsert({
      where: { adminUserId_permissionName: { adminUserId: moderator.id, permissionName: perm } },
      update: {},
      create: { adminUserId: moderator.id, permissionName: perm },
    });
  }
  console.log('✓ Admin users seeded');

  // ── Test Student ─────────────────────────────────────────────────────────────
  const studentPassword = await bcrypt.hash('Test@123', 10);
  const student = await prisma.user.upsert({
    where: { email: 'student@test.rw' },
    update: {},
    create: {
      fullName: 'Alice Uwimana',
      email: 'student@test.rw',
      passwordHash: studentPassword,
      phone: '+250788000001',
      role: 'student',
      emailVerifiedAt: new Date(),
      accountStatus: 'active',
    },
  });

  await prisma.studentProfile.upsert({
    where: { userId: student.id },
    update: {},
    create: {
      userId: student.id,
      headline: 'Computer Science Student at University of Rwanda',
      biography: 'Passionate about software development and data science. Looking for internship opportunities to apply my skills.',
      location: 'Kigali, Rwanda',
      linkedinUrl: 'https://linkedin.com/in/alice-uwimana',
      githubUrl: 'https://github.com/alice-uwimana',
      profileCompletion: 65,
    },
  });

  await prisma.education.upsert({
    where: { id: 'seed-edu-001' },
    update: {},
    create: {
      id: 'seed-edu-001',
      userId: student.id,
      institution: 'University of Rwanda',
      qualification: "Bachelor's Degree",
      fieldOfStudy: 'Computer Science',
      startDate: new Date('2021-09-01'),
      endDate: new Date('2025-06-30'),
      description: 'Studying software engineering, algorithms, and data structures.',
    },
  });
  console.log('✓ Test student seeded');

  // ── Test Employer ─────────────────────────────────────────────────────────────
  const employerPassword = await bcrypt.hash('Test@123', 10);
  const employer = await prisma.user.upsert({
    where: { email: 'employer@test.rw' },
    update: {},
    create: {
      fullName: 'Bob Nkurunziza',
      email: 'employer@test.rw',
      passwordHash: employerPassword,
      phone: '+250788000002',
      role: 'employer',
      emailVerifiedAt: new Date(),
      accountStatus: 'active',
    },
  });

  const org = await prisma.organization.upsert({
    where: { ownerUserId: employer.id },
    update: {},
    create: {
      ownerUserId: employer.id,
      organizationName: 'TechRwanda Solutions',
      organizationType: 'private',
      industry: 'Information Technology',
      description: 'A leading technology company in Rwanda providing software development, IT consulting, and digital transformation services.',
      website: 'https://techRwanda.rw',
      email: 'hr@techRwanda.rw',
      phone: '+250788100000',
      location: 'Kigali, Gasabo District',
      verificationStatus: 'verified',
      verifiedAt: new Date(),
      verifiedById: superAdmin.id,
    },
  });

  const studentCv = await prisma.cV.upsert({
    where: { id: 'seed-cv-001' },
    update: {},
    create: {
      id: 'seed-cv-001',
      userId: student.id,
      fileName: 'Alice_Uwimana_CV.pdf',
      filePath: '/uploads/cvs/alice-uwimana-cv.pdf',
      isDefault: true,
      uploadedAt: new Date(),
    },
  });
  console.log('✓ Test employer seeded');

  // ── Sample Opportunities ──────────────────────────────────────────────────────
  const internshipCat = await prisma.category.findUnique({ where: { categoryName: 'Internships' } });
  const fullTimeCat = await prisma.category.findUnique({ where: { categoryName: 'Full-time Jobs' } });
  const gradCat = await prisma.category.findUnique({ where: { categoryName: 'Graduate Programs' } });
  const remoteCat = await prisma.category.findUnique({ where: { categoryName: 'Remote Jobs' } });
  const trainingCat = await prisma.category.findUnique({ where: { categoryName: 'Training' } });
  const scholarshipCat = await prisma.category.findUnique({ where: { categoryName: 'Scholarships' } });

  const opportunities = [
    {
      organizationId: org.id,
      categoryId: internshipCat.id,
      title: 'Software Development Intern',
      slug: 'software-development-intern-techRwanda-2025',
      description: 'Join our engineering team as a software development intern. You will work on real projects, learn modern development practices, and contribute to our product roadmap.',
      responsibilities: 'Assist in developing web applications\nWrite clean, maintainable code\nParticipate in code reviews\nCollaborate with senior developers\nDocument technical specifications',
      qualifications: 'Currently enrolled in Computer Science or related field\nBasic knowledge of JavaScript or Python\nStrong problem-solving skills\nGood communication skills',
      requiredSkills: 'JavaScript,Python,React.js',
      location: 'Kigali, Rwanda',
      workArrangement: 'hybrid',
      employmentType: 'internship',
      salaryMin: 50000,
      salaryMax: 80000,
      currency: 'rwf',
      applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      status: 'published',
      approvedById: superAdmin.id,
      approvedAt: new Date(),
      publishedAt: new Date(),
    },
    {
      organizationId: org.id,
      categoryId: fullTimeCat.id,
      title: 'Full Stack Developer',
      slug: 'full-stack-developer-techRwanda-2025',
      description: 'We are looking for an experienced Full Stack Developer to join our growing team. You will design and build scalable web applications for our clients across East Africa.',
      responsibilities: 'Design and develop full-stack web applications\nCollaborate with product and design teams\nOptimize application performance\nMentor junior developers\nParticipate in agile ceremonies',
      qualifications: "Bachelor's degree in Computer Science or equivalent\n2+ years of professional experience\nStrong portfolio of completed projects\nExperience with cloud platforms",
      requiredSkills: 'JavaScript,React.js,Node.js,SQL',
      location: 'Kigali, Rwanda',
      workArrangement: 'onsite',
      employmentType: 'full_time',
      salaryMin: 400000,
      salaryMax: 700000,
      currency: 'rwf',
      applicationDeadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
      status: 'published',
      approvedById: superAdmin.id,
      approvedAt: new Date(),
      publishedAt: new Date(),
    },
    {
      organizationId: org.id,
      categoryId: gradCat.id,
      title: 'Graduate Trainee Program — Technology',
      slug: 'graduate-trainee-technology-techRwanda-2025',
      description: 'Our 12-month Graduate Trainee Program is designed for recent graduates who want to launch their careers in technology. Trainees rotate through different departments and receive mentorship from senior staff.',
      responsibilities: 'Rotate through Engineering, Product, and Operations teams\nComplete assigned projects in each rotation\nAttend weekly training sessions\nPresent findings to management\nContribute to team goals',
      qualifications: 'Recent graduate (within 2 years) in any STEM field\nStrong academic record\nEagerness to learn\nGood interpersonal skills',
      requiredSkills: 'Communication,Problem Solving,Teamwork',
      location: 'Kigali, Rwanda',
      workArrangement: 'onsite',
      employmentType: 'full_time',
      salaryMin: 200000,
      salaryMax: 300000,
      currency: 'rwf',
      applicationDeadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      status: 'published',
      approvedById: superAdmin.id,
      approvedAt: new Date(),
      publishedAt: new Date(),
    },
    {
      organizationId: org.id,
      categoryId: remoteCat.id,
      title: 'Remote Frontend Developer',
      slug: 'remote-frontend-developer-techrwanda-2026',
      description: 'Work remotely with our product team to create fast, accessible web experiences for organisations across Rwanda and East Africa.',
      responsibilities: 'Build responsive React interfaces\nCollaborate with designers and backend developers\nReview code and improve frontend quality\nParticipate in remote sprint planning and demos',
      qualifications: 'At least one year of frontend development experience\nComfortable working independently in a remote team\nStrong knowledge of JavaScript, React, and Git',
      requiredSkills: 'JavaScript,React.js,Communication,Problem Solving',
      location: 'Remote — Rwanda',
      workArrangement: 'remote',
      employmentType: 'full_time',
      salaryMin: 450000,
      salaryMax: 650000,
      currency: 'rwf',
      applicationDeadline: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000),
      status: 'published',
      approvedById: superAdmin.id,
      approvedAt: new Date(),
      publishedAt: new Date(),
    },
    {
      organizationId: org.id,
      categoryId: trainingCat.id,
      title: 'Digital Skills Bootcamp',
      slug: 'digital-skills-bootcamp-techrwanda-2026',
      description: 'A practical eight-week training programme for early-career professionals who want to strengthen their digital, data, and workplace skills.',
      responsibilities: 'Attend instructor-led workshops\nComplete hands-on assignments\nTake part in team projects\nPresent a final portfolio project',
      qualifications: 'Open to students, graduates, and job seekers\nBasic computer literacy\nCommitment to attend the full eight-week programme',
      requiredSkills: 'Communication,Teamwork,Problem Solving',
      location: 'Kigali, Rwanda',
      workArrangement: 'hybrid',
      employmentType: 'contract',
      salaryMin: 0,
      salaryMax: 0,
      currency: 'rwf',
      applicationDeadline: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
      status: 'published',
      approvedById: superAdmin.id,
      approvedAt: new Date(),
      publishedAt: new Date(),
    },
    {
      organizationId: org.id,
      categoryId: scholarshipCat.id,
      title: 'STEM Excellence Scholarship 2026',
      slug: 'stem-excellence-scholarship-techrwanda-2026',
      description: 'A merit-based scholarship supporting Rwandan undergraduate students studying science, technology, engineering, or mathematics.',
      responsibilities: 'Submit academic records and a motivation letter\nMaintain strong academic progress\nJoin quarterly mentorship sessions\nShare an end-of-year learning reflection',
      qualifications: 'Currently enrolled in an accredited Rwandan university\nStudying a STEM-related programme\nDemonstrated academic merit and financial need',
      requiredSkills: 'Research,Communication,Critical Thinking',
      location: 'Rwanda',
      workArrangement: 'remote',
      employmentType: 'contract',
      salaryMin: 0,
      salaryMax: 0,
      currency: 'rwf',
      applicationDeadline: new Date(Date.now() + 55 * 24 * 60 * 60 * 1000),
      status: 'published',
      approvedById: superAdmin.id,
      approvedAt: new Date(),
      publishedAt: new Date(),
    },
    {
      organizationId: org.id,
      categoryId: fullTimeCat.id,
      title: 'Product Designer',
      slug: 'product-designer-techrwanda-solutions-2025',
      description: 'We are looking for a creative product designer who can turn real user needs into elegant, accessible digital experiences for our clients.',
      responsibilities: 'Lead UX research and product workshops\nCreate flows, wireframes, and high-fidelity designs\nCollaborate with engineers and PMs\nTrack design quality and usability improvements',
      qualifications: 'Portfolio of mobile or web design work\nExperience with Figma and design systems\nUnderstanding of UX and accessibility best practices',
      requiredSkills: 'UI/UX Design,Research,Communication,Design Systems',
      location: 'Kigali, Rwanda',
      workArrangement: 'hybrid',
      employmentType: 'full_time',
      salaryMin: 350000,
      salaryMax: 600000,
      currency: 'rwf',
      applicationDeadline: new Date(Date.now() + 26 * 24 * 60 * 60 * 1000),
      status: 'published',
      approvedById: superAdmin.id,
      approvedAt: new Date(),
      publishedAt: new Date(),
    },
    {
      organizationId: org.id,
      categoryId: fullTimeCat.id,
      title: 'Data Analyst',
      slug: 'data-analyst-techrwanda-solutions-2025',
      description: 'Help our teams interpret data, uncover trends, and turn complex business information into actionable recommendations.',
      responsibilities: 'Analyze product and customer data\nBuild dashboards and reports\nPresent insights to cross-functional teams\nImprove reporting quality and automation',
      qualifications: 'Bachelor\'s degree in statistics, economics, or related field\nStrong SQL and Excel skills\nAbility to communicate actionable insights',
      requiredSkills: 'SQL,Data Analysis,Python,Report Writing',
      location: 'Remote / Kigali',
      workArrangement: 'remote',
      employmentType: 'full_time',
      salaryMin: 320000,
      salaryMax: 520000,
      currency: 'rwf',
      applicationDeadline: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000),
      status: 'published',
      approvedById: superAdmin.id,
      approvedAt: new Date(),
      publishedAt: new Date(),
    },
  ];

  for (const opp of opportunities) {
    await prisma.opportunity.upsert({
      where: { slug: opp.slug },
      update: {},
      create: opp,
    });
  }

  const featuredOpportunity = await prisma.opportunity.findUnique({ where: { slug: 'software-development-intern-techRwanda-2025' } });
  if (featuredOpportunity) {
    const application = await prisma.application.upsert({
      where: { opportunityId_applicantId: { opportunityId: featuredOpportunity.id, applicantId: student.id } },
      update: { applicationStatus: 'under_review' },
      create: {
        opportunityId: featuredOpportunity.id,
        applicantId: student.id,
        cvId: studentCv.id,
        coverLetter: 'I am excited to apply for the Software Development Intern role and would love to contribute to your team through hands-on software engineering work. My background in JavaScript, React, and Python aligns well with the position.',
        applicationStatus: 'under_review',
      },
    });

    const conversation = await prisma.conversation.upsert({
      where: { opportunityId_employerId_applicantId: { opportunityId: featuredOpportunity.id, employerId: org.id, applicantId: student.id } },
      update: {},
      create: {
        opportunityId: featuredOpportunity.id,
        employerId: org.id,
        applicantId: student.id,
      },
    });

    const messageCount = await prisma.message.count({ where: { conversationId: conversation.id } });
    if (messageCount === 0) {
      await prisma.message.createMany({
        data: [
          {
            conversationId: conversation.id,
            senderId: student.id,
            message: 'Hello, I am very interested in the software development internship. I have been building web applications with JavaScript and React and would love to contribute to your team.',
            readAt: new Date(),
          },
          {
            conversationId: conversation.id,
            senderId: employer.id,
            message: 'Thank you for reaching out. We would love to review your CV and portfolio. Please share your GitHub or any relevant project links.',
            readAt: new Date(),
          },
        ],
      });
    }

    await prisma.notification.createMany({
      data: [
        {
          userId: student.id,
          title: 'Application update',
          message: `Your application for "${featuredOpportunity.title}" is now under review.`,
          notificationType: 'application',
        },
        {
          userId: employer.id,
          title: 'New message from applicant',
          message: `${student.fullName} sent you a message about "${featuredOpportunity.title}".`,
          notificationType: 'message',
        },
        {
          userId: student.id,
          title: 'New message',
          message: `The employer replied about "${featuredOpportunity.title}". Please check your inbox.`,
          notificationType: 'message',
        },
      ],
    });

    await prisma.applicationStatusHistory.upsert({
      where: { id: `seed-status-${application.id}` },
      update: {},
      create: {
        id: `seed-status-${application.id}`,
        applicationId: application.id,
        oldStatus: 'submitted',
        newStatus: 'under_review',
        changedById: employer.id,
        notes: 'Application moved to review after initial screening.',
      },
    });
  }

  console.log('✓ Sample opportunities seeded');

  console.log('\n✅ Database seeded successfully!\n');
  console.log('Test Accounts:');
  console.log('  Super Admin : admin@careerbridge.rw     / Admin@123');
  console.log('  Moderator   : moderator@careerbridge.rw / Mod@123');
  console.log('  Student     : student@test.rw           / Test@123');
  console.log('  Employer    : employer@test.rw          / Test@123');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
