import { PrismaClient, RoleWhereInput, RoleCreateInput, RoleUpdateInput, BatchPayload, Role, SystemPermissionEnum } from "@prisma/client";

import { CreateRoleInput } from "./RoleService";

class RolePrismaAdapter {
  prisma: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
  }

  getRoleById(roleId: string) {
    return this.prisma.role.findOne({
      where: {
        id: roleId,
      }
    })
  }

  updatePermissions(roleId: string, permissions: SystemPermissionEnum[]) {
    return this.prisma.role.update({
      where: {
        id: roleId,
      },
      data: {
        permissions: {
          // TODO: Set to appropriate logic
          set: permissions
        },
      }
    })
  }

  update(roleId: string, data: RoleUpdateInput): Promise<Role> {
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

  create(data: RoleCreateInput): Promise<Role> {
    return this.prisma.role.create({
      data,
    })
  }

  deleteMany(roleIds: string[]): Promise<BatchPayload> {
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

  count(where: RoleWhereInput): Promise<number> {
    return this.prisma.role.count({
      where,
    });
  };

  findRolesPaginated(where: RoleWhereInput, take?: number | undefined, skip?: number | undefined): Promise<Role[]> {
    return this.prisma.role.findMany({
      where,
      take,
      skip,
    });
  };

};

export default RolePrismaAdapter;
