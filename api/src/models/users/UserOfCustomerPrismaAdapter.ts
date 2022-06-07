import { PrismaClient, UserOfCustomer, Prisma } from '@prisma/client';

class UserOfCustomerPrismaAdapter {
  prisma: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
  };

  /**
   * Finds all users based on either user ID(s) and/or role ID(s)
   * @param workspaceSlug 
   * @param targetIds 
   * @returns a list of users
   */
  async findTargetUsers(workspaceSlug: string, targetIds: { userIds: string[]; roleIds: string[] }) {
    return this.prisma.userOfCustomer.findMany({
      where: {
        AND: [
          {
            customer: {
              slug: workspaceSlug,
            },
          },
          {
            isActive: true,
          },
          {
            OR: [
              {
                roleId: {
                  in: targetIds.roleIds,
                },
              },
              {
                userId: {
                  in: targetIds.userIds,
                },
              },
            ],
          },
        ],
      },
      include: {
        user: true,
        customer: true,
      },
    });
  }

  /**
   * Upserts an entry in UserOfCustomer table
   * @param workspaceId 
   * @param userId 
   * @param roleId 
   * @returns 
   */
  upsertUserOfCustomer = (workspaceId: string, userId: string, roleId: string) => {
    return this.prisma.userOfCustomer.upsert({
      where: {
        userId_customerId: {
          userId: userId,
          customerId: workspaceId,
        },
      },
      update: {
        user: {
          connect: {
            id: userId,
          },
        },
        customer: {
          connect: {
            id: workspaceId,
          },
        },
        role: {
          connect: {
            id: roleId,
          },
        },
      },
      create: {
        user: {
          connect: {
            id: userId,
          },
        },
        customer: {
          connect: {
            id: workspaceId,
          },
        },
        role: {
          connect: {
            id: roleId,
          },
        },
      },
    })
  }

  /**
   * Upserts a user and assignes it to a private dialogue
   * @param emailAddress 
   * @param dialogueId 
   * @param phoneNumber 
   * @returns 
   */
  addUserToPrivateDialogue = (emailAddress: string, dialogueId: string, phoneNumber?: string) => {
    return this.prisma.user.upsert({
      where: {
        email: emailAddress,
      },
      create: {
        email: emailAddress,
        phone: phoneNumber,
        isAssignedTo: {
          connect: {
            id: dialogueId,
          },
        },
      },
      update: {
        isAssignedTo: {
          connect: {
            id: dialogueId,
          },
        },
      },
    });
  }

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
            settings: { include: { colourSettings: true } },
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
        },
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
            name: true,
          },
        },
      },
    });
  };

  /**
   * Finds a single userCustomer by the ids.
   * */
  findUserCustomerByIds(customerId: string, userId: string) {
    return this.prisma.userOfCustomer.findUnique({
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
  create(data: Prisma.UserOfCustomerCreateInput): Promise<UserOfCustomer> {
    return this.prisma.userOfCustomer.create({
      data,
    });
  };
};

export default UserOfCustomerPrismaAdapter;
