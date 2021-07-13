import { UserOfCustomerPrismaAdapterType } from "./UserOfCustomerPrismaAdapterType";
import { PrismaClient, UserOfCustomer, UserOfCustomerCreateInput, UserOfCustomerUpdateInput } from "@prisma/client";

class UserOfCustomerPrismaAdapter implements UserOfCustomerPrismaAdapterType {
  prisma: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
  }
  delete(userId: string, customerId: string): Promise<UserOfCustomer> {
    return this.prisma.userOfCustomer.delete({
      where: {
        userId_customerId: {
          customerId: customerId,
          userId: userId,
        },
      },
    });
  }

  updateWorkspaceUserRole(userId: string, customerId: string, roleId: string | null | undefined): Promise<UserOfCustomer> {
    return this.prisma.userOfCustomer.update({
      where: {
        userId_customerId: {
          customerId,
          userId,
        }
      },
      data: {
        role: {
          connect: {
            id: roleId || undefined,
          },
        },
      },
    })
  }

  update(userId: string, customerId: string, data: UserOfCustomerUpdateInput): Promise<UserOfCustomer> {
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

  create(data: UserOfCustomerCreateInput): Promise<UserOfCustomer> {
    return this.prisma.userOfCustomer.create({
      data,
    });
  }
}

export default UserOfCustomerPrismaAdapter;
