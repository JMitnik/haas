import { PrismaClient } from '@prisma/client';
// or const { PrismaClient } = require('@prisma/client')
import { formatDistance, subDays } from 'date-fns';

const prisma = new PrismaClient();

async function main() {
  // ... you will write your Prisma Client queries here
  const permissions = await prisma.permission.findMany({
    include: {
      isPermissionOfRole: {
        select: {
          id: true,
        },
      },
    },
  });

  console.log('permissions: ', permissions[0].isPermissionOfRole);
}
main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.disconnect();
  });
