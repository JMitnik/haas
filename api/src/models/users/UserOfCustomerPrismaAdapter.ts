import { UserOfCustomerPrismaAdapterType } from "./UserOfCustomerPrismaAdapterType";
import { PrismaClient, UserOfCustomerCreateInput, UserOfCustomerUpdateInput } from "@prisma/client";

class UserOfCustomerPrismaAdapter implements UserOfCustomerPrismaAdapterType {
  prisma: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
  }
  delete(userId: string, customerId: string): Promise<import("@prisma/client").UserOfCustomer> {
    return this.prisma.userOfCustomer.delete({
      where: {
        userId_customerId: {
          customerId: customerId,
          userId: userId,
        },
      },
    });
  }

  update(userId: string, customerId: string, data: UserOfCustomerUpdateInput): Promise<import("@prisma/client").UserOfCustomer> {
    return this.prisma.userOfCustomer.update({
      where: {
        userId_customerId: {
          customerId,
          userId,
        }
      },
      data,
    })
  }

  getByIds(customerId: string, userId: string) {
    return this.prisma.userOfCustomer.findOne({
      where: {
        userId_customerId: {
          customerId,
          userId: userId,
        },
      },
      include: {
        customer: true,
        role: true,
        user: true,
      },
    });;
  };

  create(data: UserOfCustomerCreateInput): Promise<import("@prisma/client").UserOfCustomer> {
    return this.prisma.userOfCustomer.create({
      data,
    });
  }
}

export default UserOfCustomerPrismaAdapter;
