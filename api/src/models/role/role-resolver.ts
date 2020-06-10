import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

class RoleResolver {
  static roles = async (customerId: string) => {
    const roles = await prisma.role.findMany({
      where: { customerId },
      include: {
        permissions: true,
      },
    });
    const mappedRoles = roles.map((role) => ({ ...role, amtPermissions: role.permissions.length }));
    return mappedRoles;
  };

  static deleteRoles = async (roleIds: Array<string>) => prisma.role.deleteMany({ where: {
    id: {
      in: roleIds,
    },
  } });
}

export default RoleResolver;
