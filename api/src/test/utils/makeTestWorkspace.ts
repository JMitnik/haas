import { PrismaClient, SystemPermissionEnum } from 'prisma/prisma-client';

export const makeTestWorkspace = async (prisma: PrismaClient) => {
  return prisma.userOfCustomer.create({
    data: {
      customer: {
        create: {
          name: 'Customer',
          slug: 'CUSTOMER_SLUG',
        },
      },
      role: {
        create: {
          name: 'ADMIN',
          permissions: [...Object.values(SystemPermissionEnum)],
          type: 'ADMIN',
        },
      },
      user: {
        create: {
          email: 'admin@haas.com',
          firstName: 'haas',
          lastName: 'admin',
        },
      },
    },
    include: {
      user: {
        select: {
          id: true,
        },
      },
    },
  });
}
