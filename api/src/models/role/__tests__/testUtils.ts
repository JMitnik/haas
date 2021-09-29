import { PrismaClient } from "@prisma/client";

export const clearDatabase = async (prisma: PrismaClient) => {
  const delPermissions = prisma.permission.deleteMany({});
  const delRoles = prisma.role.deleteMany({});
  const delWorkspaces = prisma.customer.deleteMany({});

  await prisma.$transaction([
    delPermissions,
    delRoles,
    delWorkspaces
  ])
}