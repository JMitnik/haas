import { PrismaClient, SystemPermissionEnum } from "@prisma/client";

/**
 * Generates a workspace in a database.
 * @param prisma
 * @returns
 */
export const seedWorkspace = async (prisma: PrismaClient) => {
  const workspace = await prisma.customer.create({
    data: {
      name: 'Test workspace',
      slug: 'TEST_WORKSPACE',
    }
  });

  return workspace;
}

/**
 * Generates a dialogue, connected to a specific dialogue.
 * @param prisma
 * @param customerId
 * @returns
 */
export const seedDialogue = async (prisma: PrismaClient, workspaceId: string) => {
  const dialogue = await prisma.dialogue.create({
    data: {
      customerId: workspaceId,
      title: 'Test dialogue',
      slug: 'TEST_DIALOGUE',
      description: 'A test dialogue'
    }
  });

  return dialogue;
}

/**
 * Generates a user with given permissions for a workspace.
 * @param prisma
 * @param workspaceId
 * @param rolePermissions
 * @returns
 */
export const seedUser = async (prisma: PrismaClient, workspaceId: string, rolePermissions: SystemPermissionEnum[]) => {
  const user = await prisma.user.create({
    data: {
      id: 'TEST_USER',
      email: 'TEST@Hotmail.com',
    }
  });

  const userRole = await prisma.role.create({
    data: {
      name: 'UserRole',
      permissions: rolePermissions
    }
  });

  const userRoleUser = await prisma.userOfCustomer.create({
    data: {
      customer: { connect: { id: workspaceId } },
      user: { connect: { id: user.id } },
      role: { connect: { id: userRole.id } }
    }
  });

  return { user, userRole, userRoleUser }
}
