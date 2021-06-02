import { UserOfCustomerPrismaAdapterType } from "./UserOfCustomerPrismaAdapterType";
import { PrismaClient, UserOfCustomerCreateInput } from "@prisma/client";

class UserOfCustomerPrismaAdapter implements UserOfCustomerPrismaAdapterType {
  prisma: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
  }

  create(data: UserOfCustomerCreateInput): Promise<import("@prisma/client").UserOfCustomer> {
    return this.prisma.userOfCustomer.create({
      data,
    });
  }
}

export default UserOfCustomerPrismaAdapter;
