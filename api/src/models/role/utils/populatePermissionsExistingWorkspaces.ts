import { Prisma } from '@prisma/client';
import prisma from '../../../config/prisma';
import { SystemPermissions } from '../Permissions';

const constructPermissionCreateArgs = (workspaceId: string) => {
  const mappedPermissions: Prisma.Enumerable<Prisma.PermissionCreateManyInput> = SystemPermissions.map((systemPermission) => {
    return { type: systemPermission, customerId: workspaceId, name: systemPermission }
  });
  return mappedPermissions;
};

export const populatePermissions = async () => {
  try {
    const allWorkspaces = await prisma.customer.findMany({
      include: {
        permissions: true,
      }
    });

    // TODO: Add support for missing permissions 
    const workspacesWithoutPermissions = allWorkspaces.filter((workspace) => workspace.permissions.length === 0);
    console.log('Workspaces without permissions: ', workspacesWithoutPermissions.length);

    if (workspacesWithoutPermissions.length === 0) return console.log('All workspaces have permissions. No actions taken.');
    await Promise.all(workspacesWithoutPermissions.map(async (workspace) => {
      await prisma.permission.createMany({
        data: constructPermissionCreateArgs(workspace.id),
      });
    })).then(() => console.log('Finished creating permissions for workspace.'));
  } finally {
    prisma.$disconnect();
  }
};

populatePermissions()
