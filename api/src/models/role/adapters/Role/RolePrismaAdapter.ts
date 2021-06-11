import { RolePrismaAdapterType } from "./RolePrismaAdapterType";
import { PrismaClient, RoleWhereInput, RoleCreateInput, RoleUpdateInput } from "@prisma/client";

class RolePrismaAdapter implements RolePrismaAdapterType {
  prisma: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
  }


  getRoleById(roleId: string){
    return this.prisma.role.findOne({
      where: {
        id: roleId,
      }
    })
  }

  update(roleId: string, data: RoleUpdateInput): Promise<import("@prisma/client").Role> {
    return this.prisma.role.update({
      where: {
        id: roleId,
      },
      data: data,
    });
  }

  create(data: RoleCreateInput): Promise<import("@prisma/client").Role> {
    return this.prisma.role.create({
      data,
    })
  }

  deleteMany(roleIds: string[]): Promise<import("@prisma/client").BatchPayload> {
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
    })
  }

  findManyPaginated(where: RoleWhereInput, take?: number | undefined, skip?: number | undefined): Promise<import("@prisma/client").Role[]> {
    return this.prisma.role.findMany({
      where,
      take,
      skip,
    });
  }


}

export default RolePrismaAdapter;
