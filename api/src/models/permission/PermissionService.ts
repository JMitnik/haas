import { PrismaClient } from '@prisma/client';
import prisma from '../../prisma';

class PermissionService {
  static deletePermissions = async (permissionIds: Array<string>) => {
    prisma.permission.deleteMany({
      where: {
        id: {
          in: permissionIds,
        },
      },
    });
  };

  static createPermission = async (name: string, customerId: string, description?: string | null | undefined) => {
    const newPermissions = await prisma.permission.create({
      data: {
        name,
        description,
        Customer: {
          connect: { id: customerId },
        },
      },
      include: {
        Customer: true,
      },
    });

    return newPermissions;
  };
}
export default PermissionService;
