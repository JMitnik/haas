import { PrismaClient } from 'prisma/prisma-client';

export const makeAdminUser = async (prisma: PrismaClient) => {
  return prisma.user.create({
    data: {
      email: 'super@admin.com',
      globalPermissions: ['CAN_ACCESS_ADMIN_PANEL'],
    },
  });
}
