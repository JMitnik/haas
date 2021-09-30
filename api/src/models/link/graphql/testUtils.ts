import { PrismaClient } from "@prisma/client";

export const clearDatabase = async (prisma: PrismaClient) => {
  const delUsers = prisma.user.deleteMany({});
  const delDialogues = prisma.dialogue.deleteMany({});
  const delWorkspaces = prisma.customer.deleteMany({});

  await prisma.$transaction([
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
      globalPermissions: {
        set: ['CAN_ACCESS_ADMIN_PANEL'],
      }
    }
  });

  return {
    user,
    workspace
  }
}