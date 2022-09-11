import { PrismaClient, User, Prisma, UserOfCustomer } from '@prisma/client';
import _, { cloneDeep, reject } from 'lodash';

import { RegisterUserInput } from './UserPrismaAdapterType';
import RoleService from '../role/RoleService';
import { NexusGenInputs } from '../../generated/nexus';


class UserPrismaAdapter {
  prisma: PrismaClient;
  roleService: RoleService;

  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
    this.roleService = new RoleService(prismaClient);
  }

  /**
   * Upserts a user by checking if the email already exists or not
   * @param input
   * @returns
   */
  upsertUserByEmail = async (input: Prisma.UserCreateInput) => {
    return this.prisma.user.upsert({
      where: {
        email: input.email,
      },
      create: { ...input, id: input.id },
      update: { ...input, id: input.id },
    })
  }

  /**
   * Finds the private dialogues assigned to an user
   * @param userId
   */
  findPrivateDialogueOfUser = async (userId: string, workspaceSlug?: string) => {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        isAssignedTo: workspaceSlug ? {
          where: {
            customer: {
              slug: workspaceSlug,
            },
          },
        } : true,
      },
    });

    return user;
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
   * Adjusts the dialogue privacy settings of a user based on the input. The input consits one list of dialogue ids
   * which should be disconnected and another which should be connected to the user
   * @param input
   * @returns
   */
  updateDialogueAssignmentOfUser = async (input: NexusGenInputs['AssignUserToDialogueInput']) => {
    return this.prisma.user.update({
      where: {
        id: input?.userId,
      },
      data: {
        isAssignedTo: {
          disconnect: !input.state ? {
            id: input.dialogueId,
          } : undefined,
          connect: input.state ? {
            id: input.dialogueId,
          } : undefined,
        },
      },
      include: {
        isAssignedTo: true,
      },
    });
  }

  /**
   * Adjusts the dialogue privacy settings of a user based on the input. The input consits one list of dialogue ids
   * which should be disconnected and another which should be connected to the user
   * @param input
   * @returns
   */
  updateUserPrivateDialogues = async (input: NexusGenInputs['AssignUserToDialoguesInput']) => {
    const user = await this.prisma.user.findUnique({
      where: {
        id: input.userId,
      },
      include: {
        isAssignedTo: {
          where: {
            customerId: input.workspaceId,
          },
        },
      },
    });

    const dbAssignedDialogues = user?.isAssignedTo.map((dialogue) => ({ id: dialogue.id })) || [];
    const disconnectedDialogues = reject(dbAssignedDialogues,
      (dialogue) => input.assignedDialogueIds?.includes(dialogue.id) || false) || [];

    return this.prisma.user.update({
      where: {
        id: input?.userId,
      },
      data: {
        isAssignedTo: {
          disconnect: disconnectedDialogues,
          connect: input?.assignedDialogueIds?.map((dialogueId) => ({ id: dialogueId })) || [],
        },
      },
      include: {
        isAssignedTo: true,
      },
    });
  }

  /**
   * Find all workspaces belonging to user id.
   * @param userId
   * @returns a list of workspaces together and whether a user is active in them or not
   */
  findAllWorkspacesByUserId = async (userId: string) => {
    const userWorkspaces = await this.prisma.userOfCustomer.findMany({
      where: {
        userId,
      },
      select: {
        isActive: true,
        customer: true,
      },
    });

    return userWorkspaces;
  }

  /**
  * Build a userConnection prisma query based on the filter parameters.
  * @param customerSlug the slug of a workspace
  * @param filter a filter containing information in regard to used search queries, date ranges and order based on column
  */
  buildFindUsersQuery = (customerSlug: string, filter?: NexusGenInputs['UserConnectionFilterInput'] | null): Prisma.UserOfCustomerWhereInput => {
    let userOfCustomerWhereInput: Prisma.UserOfCustomerWhereInput = {
      customer: {
        slug: customerSlug,
      },
      user: {},
      role: {},
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
          { role: { name: { contains: filter.search, mode: 'insensitive' } } },
          { user: { email: { contains: filter.search, mode: 'insensitive' } } },
          { user: { firstName: { contains: filter.search, mode: 'insensitive' } } },
          { user: { lastName: { contains: filter.search, mode: 'insensitive' } } },
        ],
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

    if (filter?.role && userOfCustomerWhereInput.role) {
      userOfCustomerWhereInput.role.name = { contains: filter.role, mode: 'insensitive' }
    }

    return userOfCustomerWhereInput;
  }

  orderUsersBy = (
    usersOfCustomer: (UserOfCustomer & {
      user: {
        firstName: string | null;
        lastName: string | null;
        email: string;
      };
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
    } if (filter?.orderBy?.by === 'lastActivity') {
      return _.orderBy(usersOfCustomer, (userOfCustomer) => userOfCustomer.user.email, filter.orderBy.desc ? 'desc' : 'asc');
    }

    return usersOfCustomer;
  };

  /**
  * Order userOfCustomer by UserConnectionFilterInput
  * @param filter
  */
  buildOrderByQuery = (filter?: NexusGenInputs['UserConnectionFilterInput'] | null) => {
    let orderByQuery: Prisma.UserOfCustomerOrderByWithRelationInput[] = [];

    if (filter?.orderBy?.by === 'createdAt') {
      orderByQuery.push({
        createdAt: filter.orderBy.desc ? 'desc' : 'asc',
      });
    };

    if (filter?.orderBy?.by === 'lastActivity') {
      orderByQuery.push({
        user: {
          lastActivity: filter.orderBy.desc ? 'desc' : 'asc',
        },
      });
    }

    if (filter?.orderBy?.by === 'firstName') {
      orderByQuery.push({
        user: { firstName: filter.orderBy.desc ? 'desc' : 'asc' },
      });
    }

    if (filter?.orderBy?.by === 'lastName') {
      orderByQuery.push({
        user: { lastName: filter.orderBy.desc ? 'desc' : 'asc' },
      });
    }

    if (filter?.orderBy?.by === 'email') {
      orderByQuery.push({
        user: { email: filter.orderBy.desc ? 'desc' : 'asc' },
      });
    }

    if (filter?.orderBy?.by === 'role') {
      orderByQuery.push({
        role: { name: filter.orderBy.desc ? 'desc' : 'asc' },
      });
    }

    if (filter?.orderBy?.by === 'isActive') {
      orderByQuery.push({
        isActive: filter.orderBy.desc ? 'desc' : 'asc',
      });
    }

    return orderByQuery;
  };

  /**
   *
   * @param customerSlug slug of a workspace
   * @param filter UserConnectionFilterInput
   * @returns amount of users based on filter criteria
   */
  countUsers = async (customerSlug: string, filter?: NexusGenInputs['UserConnectionFilterInput'] | null) => {
    const totalUsers = await this.prisma.userOfCustomer.count({
      where: this.buildFindUsersQuery(customerSlug, filter),
    });
    return totalUsers;
  };

  /**
   *
   * @param customerSlug slug of a workspace
   * @param filter UserConnectionFilterInput
   * @returns A subset of UserOfCustomer prisma entries based on specified filters
   */
  findPaginatedUsers = async (customerSlug: string, filter?: NexusGenInputs['UserConnectionFilterInput'] | null) => {
    const offset = filter?.offset ?? 0;
    const perPage = filter?.perPage ?? 5;

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

    return users;
  };

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

  async createWorkspaceUser(customerId: string, roleId: string, email: string) {
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
    return this.prisma.user.findUnique({
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
        },
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

  async setIsActive(input: { userId: string; workspaceId: string; isActive: boolean }) {
    const result = await this.prisma.userOfCustomer.update({
      where: {
        userId_customerId: {
          userId: input.userId,
          customerId: input.workspaceId,
        },
      },
      data: {
        isActive: input.isActive,
      },
      include: {
        user: true,
        role: true,
        customer: true,
      },
    });

    return result;
  }

  /**
   * Updates the user's last activity date
   */
  async updateLastSeen(userId: string | undefined, lastSeen: Date) {
    return await this.prisma.user.update({
      where: { id: userId },
      data: {
        lastActivity: lastSeen,
      },
    });
  }

  /**
   * Login user.
   *
   * - Set new refresh token
   * - Update `lastLoggedIn`
   * - Update `loginToken`
   * @param userId
   * @param refreshToken
   * @returns
   */
  async login(userId: string | undefined, refreshToken: string): Promise<User> {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        refreshToken,
        lastLoggedIn: new Date(Date.now()),
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
        },
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
