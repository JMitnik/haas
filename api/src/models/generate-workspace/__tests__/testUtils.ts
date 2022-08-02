import { PrismaClient, SystemPermissionEnum } from '@prisma/client';

export const createUserWithAllRoles = async (prisma: PrismaClient) => {
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

export const createSuperAdmin = async (prisma: PrismaClient) => {
  return prisma.user.create({
    data: {
      email: 'super@admin.com',
      globalPermissions: ['CAN_ACCESS_ADMIN_PANEL'],
    },
  });
}

export const clearDatabase = async (prisma: PrismaClient) => {
  if (process.env.NODE_ENV === 'test') {
    await prisma.$transaction([
      prisma.sliderNodeEntry.deleteMany({}),
      prisma.choiceNodeEntry.deleteMany({}),
      prisma.nodeEntry.deleteMany({}),
      prisma.session.deleteMany({}),
      prisma.automation.deleteMany({}),
      prisma.automationTrigger.deleteMany({}),
      prisma.automationEvent.deleteMany({}),
      prisma.automationConditionOperand.deleteMany({}),
      prisma.dialogueConditionScope.deleteMany({}),
      prisma.questionConditionScope.deleteMany({}),
      prisma.workspaceConditionScope.deleteMany({}),
      prisma.automationCondition.deleteMany({}),
      prisma.automationConditionBuilder.deleteMany({}),
      prisma.automationAction.deleteMany({}),
      prisma.userOfCustomer.deleteMany({}),
      prisma.user.deleteMany({}),
      prisma.questionNode.deleteMany({}),
      prisma.dialogue.deleteMany({}),
      prisma.tag.deleteMany({}),
      prisma.customer.deleteMany({}),
    ]);
  }
}