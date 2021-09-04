import { PrismaClient, User, Prisma } from "@prisma/client";

import { RegisterUserInput } from "./UserPrismaAdapterType";
import RoleService from '../role/RoleService';

class UserPrismaAdapter {
  prisma: PrismaClient;
  roleService: RoleService;

  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
    this.roleService = new RoleService(prismaClient);
  }

  /**
   *  Checks if email address already exists (not belonging to userId)
   * @email the email to look for
   * @userId the userId to ignore when it comes to looking for the email address
   */
  async emailExists(email: string, userId: string): Promise<Boolean> {
    const otherMails = await this.prisma.user.findFirst({
      where: {
        AND: {
          email: { equals: email },
          id: { not: userId },
        },
      },
    });

    return otherMails ? true : false;
  };

  getAllUsersByCustomerSlug(customerSlug: string): Promise<User[]> {
    return this.prisma.user.findMany({
      where: {
        customers: {
          every: { customer: { slug: customerSlug } },
        },
      },
    });
  };

  getUsersByTriggerId(triggerId: string): Promise<User[]> {
    return this.prisma.user.findMany({
      where: { triggers: { some: { id: triggerId } } },
    });
  };

  findUserContext(userId: string) {
    return this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        customers: {
          include: {
            customer: true,
            role: true,
          },
        },
      },
    });
  };

  async createNewUser(customerId: string, roleId: string, email: string) {
    return this.prisma.user.create({
      data: {
        email,
        customers: {
          create: {
            customer: { connect: { id: customerId } },
            role: { connect: { id: roleId } },
          },
        },
      },
      include: {
        customers: {
          include: {
            customer: {
              include: {
                settings: {
                  include: {
                    colourSettings: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  };

  async registerUser(registerUserInput: RegisterUserInput) {
    return this.prisma.user.create({
      data: {
        email: registerUserInput.email,
        firstName: registerUserInput.firstName,
        lastName: registerUserInput.lastName,
        password: registerUserInput.password,
        customers: {
          create: {
            customer: { connect: { id: registerUserInput.workspaceId || undefined } },
            role: { connect: { id: (await this.roleService.fetchDefaultRoleForCustomer(registerUserInput.workspaceId)).id || undefined } },
          },
        },
      },
      include: {
        customers: {
          include: {
            role: true,
            customer: true,
          },
        },
      },
    });
  };

  async existsWithinWorkspace(email: string, workspaceId: string): Promise<Boolean> {
    const userExists = await this.prisma.user.findFirst({
      where: {
        customers: {
          some: {
            AND: [{
              customerId: workspaceId,
            }, {
              user: {
                email,
              },
            }],
          },
        },
      },
    });

    return userExists ? true : false;
  };

  async findUserWithinWorkspace(email: string, workspaceId: string) {
    return this.prisma.user.findFirst({
      where: { email },
      include: {
        customers: {
          where: { customerId: workspaceId },
        },
      },
    });
  };

  async getUserByEmail(email: string) {
    return this.prisma.user.findFirst({
      where: {
        email: {
          equals: email,
          mode: 'insensitive',
        }
      },
      include: {
        customers: {
          include: {
            customer: true,
            role: true,
            user: true,
          },
        },
      },
    });
  };

  async getUserById(userId: string) {
    return this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        customers: {
          include: {
            customer: true,
            role: true,
            user: true,
          },
        },
      },
    });
  };

  async findFirst(where: Prisma.UserWhereInput) {
    return this.prisma.user.findFirst({
      where: where,
      include: {
        customers: {
          include: {
            customer: true,
            role: true,
            user: true,
          },
        },
      },
    });
  };

  async logout(userId: string | undefined): Promise<User> {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        refreshToken: null,
      },
    });
  };

  async setLoginToken(userId: string | undefined, loginToken: string | null): Promise<User> {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        loginToken,
      },
    });
  };

  async login(userId: string | undefined, refreshToken: string): Promise<User> {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        refreshToken,
        loginToken: null,
      },
    });
  };

  async update(userId: string | undefined, data: Prisma.UserUpdateInput): Promise<User> {
    return this.prisma.user.update({
      where: { id: userId },
      data,
    });
  };

  // TODO: Should do a findOne lookup
  async getValidUsers(loginToken: string, userId: string | undefined) {
    const validUsers = await this.prisma.user.findMany({
      where: {
        AND: {
          loginToken: {
            equals: loginToken,
          },
          id: { equals: userId },
        }
      },
      include: {
        customers: {
          include: {
            customer: true,
            role: true,
          },
        },
      },
    });

    return validUsers;
  };
}

export default UserPrismaAdapter;
