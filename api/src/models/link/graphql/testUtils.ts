import { PrismaClient } from '@prisma/client';

export const clearDatabase = async (prisma: PrismaClient) => {
  // const delUsers = prisma.user.deleteMany({});
  // const delDialogues = prisma.dialogue.deleteMany({});
  // const delWorkspaces = prisma.customer.deleteMany({});
  // const delPermissions = prisma.permission.deleteMany({});
  // const delUserRoles = prisma.role.deleteMany({});
  // const delUserOfCustomer = prisma.userOfCustomer.deleteMany({});

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
    prisma.permission.deleteMany(),
    prisma.role.deleteMany(),
    prisma.user.deleteMany({}),
    prisma.questionNode.deleteMany({}),
    prisma.dialogue.deleteMany({}),
    prisma.tag.deleteMany({}),
    prisma.customer.deleteMany({}),
  ]);
}
export const prepDefaultData = async (prisma: PrismaClient) => {
  const workspace = await prisma.customer.create({
    data: {
      name: 'Test',
      slug: 'workspaceSlug',
      dialogues: {
        create: {
          id: 'dialogueId',
          description: '',
          slug: 'dialogueSlug',
          title: 'test',
        },
      },
    },
  });

  const user = await prisma.user.create({
    data: {
      id: 'groteTest',
      email: 'email@haas.live',
    },
  });

  const userRole = await prisma.role.create({
    data: {
      name: 'UserRole',
      permissions: ['CAN_BUILD_DIALOGUE'],
    },
  });

  await prisma.userOfCustomer.create({
    data: {
      customer: { connect: { id: workspace.id } },
      user: { connect: { id: user.id } },
      role: { connect: { id: userRole.id } },
    },
  });

  return {
    user,
    workspace,
    userRole,
  }
}