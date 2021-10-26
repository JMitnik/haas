import { PrismaClient, User, Prisma, UserOfCustomer } from "@prisma/client";
import _, { cloneDeep } from "lodash";

import { RegisterUserInput } from "./UserPrismaAdapterType";
import RoleService from '../role/RoleService';
import { NexusGenInputs } from "../../generated/nexus";


class UserPrismaAdapter {
  prisma: PrismaClient;
  roleService: RoleService;

  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
    this.roleService = new RoleService(prismaClient);
  }

  buildFindUsersQuery = (customerSlug: string, filter?: NexusGenInputs['UserConnectionFilterInput'] | null): Prisma.UserOfCustomerWhereInput => {
    let userOfCustomerWhereInput: Prisma.UserOfCustomerWhereInput = {
      customer: {
        slug: customerSlug,
      },
      user: {},
    };

    if (filter?.startDate || filter?.endDate) {
      userOfCustomerWhereInput.createdAt = {
        gte: filter?.startDate ? new Date(filter.startDate) : undefined,
        lte: filter?.endDate ? new Date(filter.endDate) : undefined,
      }
    }

    if (filter?.search) {
      userOfCustomerWhereInput = {
        ...cloneDeep(userOfCustomerWhereInput),
        OR: [
          { user: { email: { contains: filter.search, mode: 'insensitive' } } },
          { user: { firstName: { contains: filter.search, mode: 'insensitive' } } },
          { user: { lastName: { contains: filter.search, mode: 'insensitive' } } },
        ]
      }
    }

    if (filter?.email && userOfCustomerWhereInput.user) {
      userOfCustomerWhereInput.user.email = { equals: filter.email, mode: 'insensitive' }
    }
    if (filter?.firstName && userOfCustomerWhereInput.user) {
      userOfCustomerWhereInput.user.firstName = { contains: filter.firstName, mode: 'insensitive' }
    }

    if (filter?.lastName && userOfCustomerWhereInput.user) {
      userOfCustomerWhereInput.user.lastName = { contains: filter.lastName, mode: 'insensitive' }
    }

    // TODO: Add role search support 

    return userOfCustomerWhereInput;
  }

  orderUsersBy = (
    usersOfCustomer: (UserOfCustomer & {
      user: {
        firstName: string | null;
        lastName: string | null;
        email: string;
      },
      role: {
        name: string;
      };
    })[],
    filter?: NexusGenInputs['UserConnectionFilterInput'] | null,
  ) => {
    if (filter?.orderBy?.by === 'firstName') {
      return _.orderBy(usersOfCustomer, (userOfCustomer) => userOfCustomer.user.firstName, filter.orderBy.desc ? 'desc' : 'asc');
    } if (filter?.orderBy?.by === 'lastName') {
      return _.orderBy(usersOfCustomer, (userOfCustomer) => userOfCustomer.user.lastName, filter.orderBy.desc ? 'desc' : 'asc');
    } if (filter?.orderBy?.by === 'email') {
      return _.orderBy(usersOfCustomer, (userOfCustomer) => userOfCustomer.user.email, filter.orderBy.desc ? 'desc' : 'asc');
    }
    // } if (filter?.orderBy?.by === 'role') { // TODO: Implement this one
    //   return _.orderBy(usersOfCustomer, (userOfCustomer) => userOfCustomer.role.name, orderBy.desc ? 'desc' : 'asc');
    // }

    return usersOfCustomer;
  };

  buildOrderByQuery = (filter?: NexusGenInputs['UserConnectionFilterInput'] | null) => {
    let orderByQuery: Prisma.UserOfCustomerOrderByInput[] = [];

    if (filter?.orderBy?.by === 'createdAt') {
      orderByQuery.push({
        createdAt: filter.orderBy.desc ? 'desc' : 'asc',
      })
    }

    return orderByQuery;
  }

  countUsers = async (customerSlug: string, filter?: NexusGenInputs['UserConnectionFilterInput'] | null) => {
    const totalUsers = await this.prisma.userOfCustomer.count({
      where: this.buildFindUsersQuery(customerSlug, filter),
    });
    return totalUsers;
  }

  findPaginatedUsers = async (customerSlug: string, filter?: NexusGenInputs['UserConnectionFilterInput'] | null) => {
    const offset = filter?.offset ?? 0;
    const perPage = filter?.perPage ?? 5;

    console.log('orderby: ', this.buildOrderByQuery(filter));

    const users = await this.prisma.userOfCustomer.findMany({
      where: this.buildFindUsersQuery(customerSlug, filter),
      skip: offset,
      take: perPage,
      orderBy: this.buildOrderByQuery(filter),
      include: {
        customer: true,
        role: true,
        user: true,
      },
    });

    const orderedUsers = this.orderUsersBy(users, filter);
    return orderedUsers;
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
