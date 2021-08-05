import { PrismaClient, UserOfCustomer, UserOfCustomerCreateInput, UserOfCustomerUpdateInput } from "@prisma/client";

class UserOfCustomerPrismaAdapter {
  prisma: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
  };

  /**
   * Gets all userCustomers by customer-slug.
   * - Includes also the customer/role/user.
   * */
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
    });
  };

  /**
   * Deletes a user-customer row.
   * */
  delete(userId: string, customerId: string): Promise<UserOfCustomer> {
    return this.prisma.userOfCustomer.delete({
      where: {
        userId_customerId: {
          customerId: customerId,
          userId: userId,
        },
      },
    });
  };

  /**
   * Creates a new user-customer role for existing customer and existing user.
   * => Returns user and customer
   * TODO: Replace this one by the connectUserToWorkspace (just include the colourSettings).
   * */
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
          },
        },
        customer: {
          include: {
            settings: { include: { colourSettings: true } }
          },
        },
      },
    });
  };

  /**
   * Updates existing userCustomer row, by updating the role.
   **/
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
          },
        },
        user: {
          select: {
            email: true,
          },
        },
        customer: {
          select: {
            name: true
          },
        },
      },
    });
  };

  /**
   * Finds a single userCustomer by the ids.
   * */
  findUserCustomerByIds(customerId: string, userId: string) {
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
    });
  };

  /**
   * Connects customer to role and user.
   * */
  connectUserToWorkspace(customerId: string, roleId: string, userId: string) {
    return this.prisma.userOfCustomer.create({
      data: {
        customer: { connect: { id: customerId } },
        role: { connect: { id: roleId } },
        user: { connect: { id: userId } },
      },
    });
  }

  /**
   * Creates userCustomer given raw data.
   * */
  create(data: UserOfCustomerCreateInput): Promise<UserOfCustomer> {
    return this.prisma.userOfCustomer.create({
      data,
    });
  };
};

export default UserOfCustomerPrismaAdapter;
