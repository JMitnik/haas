import { PrismaClient } from "@prisma/client";

export const clearDatabase = async (prisma: PrismaClient) => {
  const delUsers = prisma.user.deleteMany({});
  const delDialogues = prisma.dialogue.deleteMany({});
  const delWorkspaces = prisma.customer.deleteMany({});
  const delPermissions = prisma.permission.deleteMany({});
  const delUserRoles = prisma.role.deleteMany({});
  const delUserOfCustomer = prisma.userOfCustomer.deleteMany({});

  await prisma.$transaction([
    delUserOfCustomer,
    delPermissions,
    delUserRoles,
    delUsers,
    delDialogues,
    delWorkspaces,
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
        }
      }
    }
  });

  const user = await prisma.user.create({
    data: {
      id: 'groteTest',
      email: 'email@haas.live',
    }
  });

  const userRole = await prisma.role.create({
    data: {
      name: 'UserRole',
      permissions: ['CAN_BUILD_DIALOGUE']
    }
  });

  await prisma.userOfCustomer.create({
    data: {
      customer: { connect: { id: workspace.id } },
      user: { connect: { id: user.id } },
      role: { connect: { id: userRole.id } }
    }
  });

  return {
    user,
    workspace,
    userRole
  }
}