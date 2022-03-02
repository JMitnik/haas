import { PrismaClient, Permission } from "@prisma/client";

class PermissionPrismaAdapter {
  prisma: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
  };

  findPermissionsByCustomerId(customerId: string): Promise<Permission[]> {
    return this.prisma.permission.findMany({ where: { customerId } });
  };

};

export default PermissionPrismaAdapter;
