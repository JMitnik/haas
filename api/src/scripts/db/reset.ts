import { PrismaClient } from '@prisma/client';
export const cleanupDatabase = async () => {
  const prisma = new PrismaClient();
  const propertyNames = Object.getOwnPropertyNames(prisma);
  const modelNames = propertyNames.filter(
    (propertyName) => !propertyName.startsWith('_')
  );

  return Promise.all(modelNames.map((model) => prisma[model].deleteMany()));
};


if (process.env.NODE_ENV === 'development') {
  cleanupDatabase().then(() => {
    console.log('Database cleaned up.');
    process.exit(0);
  });
}
