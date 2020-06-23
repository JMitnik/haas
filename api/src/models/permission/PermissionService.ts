import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

class PermissionService {
  static deletePermissions = async (permssionIds: Array<string>) => {
    prisma.permission.deleteMany({
      where: {
        id: {
          in: permssionIds,
        },
      },
    });
  };

  static createPermission = async (name: string, customerId: string, description: string) => {
    const newPermissions = prisma.permission.create({
      data: {
        name,
        description,
        Customer: {
          connect: {
            id: customerId,
          },
        },
      },
    });

    return newPermissions;
  };
}
export default PermissionService;
