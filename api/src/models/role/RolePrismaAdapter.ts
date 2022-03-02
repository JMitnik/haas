import { PrismaClient, Prisma, Role, SystemPermissionEnum } from "@prisma/client";

import { CreateRoleInput } from "./RoleService";

class RolePrismaAdapter {
  prisma: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
  }

  /**
   * Gets global permissions of a user.
   * @param userId
   */
  async getGlobalPermissionsOfUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId, },
      select: { globalPermissions: true },
    });

    return user?.globalPermissions;
  }

  getRoleById(roleId: string) {
    return this.prisma.role.findUnique({
      where: {
        id: roleId,
      }
    })
  }

  update(roleId: string, data: Prisma.RoleUpdateInput): Promise<Role> {
    return this.prisma.role.update({
      where: {
        id: roleId,
      },
      data: data,
    });
  }

  createRole(data: CreateRoleInput) {
    const { customerId, permissions, name } = data;
    return this.prisma.role.create({
      data: {
        name,
        permissions: {
          set: permissions,
        },
        Customer: {
          connect: {
            id: customerId,
          },
        },
      },
    });
  }

  create(data: Prisma.RoleCreateInput): Promise<Role> {
    return this.prisma.role.create({
      data,
    })
  }

  deleteMany(roleIds: string[]): Promise<Prisma.BatchPayload> {
    return this.prisma.role.deleteMany({
      where: {
        id: { in: roleIds },
      },
    });
  }

  findManyByCustomerSlug(customerSlug: string) {
    return this.prisma.role.findMany({
      where: {
        Customer: {
          slug: customerSlug,
        }
      },
    });
  };

  count(where: Prisma.RoleWhereInput): Promise<number> {
    return this.prisma.role.count({
      where,
    });
  };

  findRolesPaginated(where: Prisma.RoleWhereInput, take?: number | undefined, skip?: number | undefined): Promise<Role[]> {
    return this.prisma.role.findMany({
      where,
      take,
      skip,
    });
  };

};

export default RolePrismaAdapter;
