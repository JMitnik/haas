import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

class PermissionResolver {
  static deletePermissions = async (permssionIds: Array<string>) => prisma.permission.deleteMany({ where: {
    id: {
      in: permssionIds,
    },
  } });
}

export default PermissionResolver;
