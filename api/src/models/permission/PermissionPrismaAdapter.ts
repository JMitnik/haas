import { PrismaClient, PermissionCreateInput } from "@prisma/client";
import { PermissionPrismaAdapterType } from "./PermissionPrismaAdapterType";

class PermissionPrismaAdapter implements PermissionPrismaAdapterType {
  prisma: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
  }

  findManyByCustomerId(customerId: string): Promise<import("@prisma/client").Permission[]> {
    return this.prisma.permission.findMany({ where: { customerId } });
  }

  async create(data: PermissionCreateInput) {
    return this.prisma.permission.create({
      data,
      include: {
        Customer: true,
      },
    })
  }

  async deleteMany(permissionIds: string[]) {
    return this.prisma.permission.deleteMany({
      where: {
        id: {
          in: permissionIds,
        },
      },
    });
  }
}

export default PermissionPrismaAdapter;
