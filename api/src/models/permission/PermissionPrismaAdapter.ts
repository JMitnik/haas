import { PrismaClient, Prisma, Permission } from "@prisma/client";
import { CreatePermissionInput } from "./PermissionService";

class PermissionPrismaAdapter {
  prisma: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
  };

  findPermissionsByCustomerId(customerId: string): Promise<Permission[]> {
    return this.prisma.permission.findMany({ where: { customerId } });
  };

  async createPermission(input: CreatePermissionInput) {
    return this.prisma.permission.create({
      data: {
        name: input.name,
        description: input.description,
        Customer: input.customerId ? {
          connect: {
            id: input.customerId,
          },
        } : undefined,
      },
    });
  };

  async deleteMany(permissionIds: string[]) {
    return this.prisma.permission.deleteMany({
      where: {
        id: {
          in: permissionIds,
        },
      },
    });
  };

};

export default PermissionPrismaAdapter;
