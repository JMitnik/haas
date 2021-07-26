import { PrismaClient, UserOfCustomer, UserOfCustomerCreateInput, UserOfCustomerUpdateInput } from "@prisma/client";

class UserOfCustomerPrismaAdapter {
  prisma: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
  }

  getAllUsersByCustomerSlug(customerSlug: string) {
    return this.prisma.userOfCustomer.findMany({
      where: {
        customer: { slug: customerSlug },
      },
      include: {
        customer: true,
        role: true,
        user: true,
      },
    })
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

  createExistingUserForInvitingWorkspace = (workspaceId: string, roleId: string, userId: string) => {
    return this.prisma.userOfCustomer.create({
      data: {
        customer: { connect: { id: workspaceId } },
        role: { connect: { id: roleId } },
        user: { connect: { id: userId } },
      },
      include: {
        user: {
          select: {
            email: true,
          }
        },
        customer: {
          include: {
            settings: { include: { colourSettings: true } }
          }
        }
      }
    });
  };

  updateWorkspaceUserRole(userId: string, customerId: string, roleId: string | null | undefined) {
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
      include: {
        role: {
          select: {
            name: true,
          }
        },
        user: {
          select: {
            email: true,
          }
        },
        customer: {
          select: {
            name: true
          }
        }
      }
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

  connectUserToWorkspace(customerId: string, roleId: string, userId: string) {
    return this.prisma.userOfCustomer.create({
      data: {
        customer: { connect: { id: customerId } },
        role: { connect: { id: roleId } },
        user: { connect: { id: userId } },
      },
    });
  }

  create(data: UserOfCustomerCreateInput): Promise<UserOfCustomer> {
    return this.prisma.userOfCustomer.create({
      data,
    });
  }
}

export default UserOfCustomerPrismaAdapter;
