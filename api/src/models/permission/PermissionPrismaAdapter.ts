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
        type: input.type,
        Customer: {
          connect: {
            id: input.customerId,
          },
        },
      },
    });
  };

  async create(data: Prisma.PermissionCreateInput) {
    return this.prisma.permission.create({
      data,
      include: {
        Customer: true,
      },
    });
  };

  async deleteManyByWorkspaceId(workspaceId: string) {
    return this.prisma.permission.deleteMany({
      where: {
        customerId: workspaceId,
      },
    });
  };

};

export default PermissionPrismaAdapter;
