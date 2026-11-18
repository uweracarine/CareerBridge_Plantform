import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Handle Prisma Client errors
prisma.$connect()
  .then(() => {
    console.log('✓ Database connection established');
  })
  .catch((error) => {
    console.error('✗ Database connection failed:', error);
    process.exit(1);
  });

export default prisma;
