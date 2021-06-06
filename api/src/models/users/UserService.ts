import { FindManyUserOfCustomerArgs, UserOfCustomer, PrismaClient, PrismaClientOptions } from '@prisma/client';

import { NexusGenInputs } from '../../generated/nexus';
import _ from 'lodash';

import { FindManyCallBackProps, PaginateProps, paginate } from '../../utils/table/pagination';
import { mailService } from '../../services/mailings/MailService';

import AuthService from '../auth/AuthService';
import makeInviteTemplate from '../../services/mailings/templates/makeInviteTemplate';
import prisma from '../../config/prisma';
import makeRoleUpdateTemplate from '../../services/mailings/templates/makeRoleUpdateTemplate';
import { UserServiceType } from './UserServiceTypes';
import { UserPrismaAdapterType } from './UserPrismaAdapterType';
import UserPrismaAdapter from './UserPrismaAdapter';

class UserService implements UserServiceType {
  prisma: PrismaClient<PrismaClientOptions, never>;
  userPrismaAdapter: UserPrismaAdapterType;

  constructor(prismaClient: PrismaClient<PrismaClientOptions, never>) {
    this.prisma = prismaClient;
    this.userPrismaAdapter = new UserPrismaAdapter(prismaClient);
  }
  findEmailWithinWorkspace(emailAddress: string, workspaceId: string) {
    return this.userPrismaAdapter.findUserWithinWorkspace(emailAddress, workspaceId);
  }

  logout(userId: string): Promise<import("@prisma/client").User> {
    return this.userPrismaAdapter.update(userId, { refreshToken: null });
  }

  setLoginToken(userId: string, loginToken: string): Promise<import("@prisma/client").User> {
    return this.userPrismaAdapter.update(userId, { loginToken });
  }

  async getUserById(userId: string) {
    return this.userPrismaAdapter.findFirst({
      id: userId
    });
  }

  async getUserByEmail(emailAddress: string): Promise<import("@prisma/client").User | null> {
    return this.userPrismaAdapter.findFirst({
      email: {
        equals: emailAddress,
        mode: 'insensitive',
      }
    })
  };

  async setRefreshToken(userId: string, refreshToken: string): Promise<import("@prisma/client").User> {
    return this.userPrismaAdapter.update(userId, { refreshToken, loginToken: null });
  };

  async getValidUsers(loginToken: string, userId: string | undefined): Promise<(import("@prisma/client").User & { customers: (UserOfCustomer & { customer: import("@prisma/client").Customer; role: import("@prisma/client").Role; })[]; })[]> {
    return this.userPrismaAdapter.getValidUsers(loginToken, userId);
  }

  // TODO: Remove as this function is not used anymore (apparently haha XD)
  async createUser(userInput: NexusGenInputs['UserInput']) {
    return this.prisma.user.create({
      data: {
        email: userInput.email,
        firstName: userInput.firstName,
        password: (userInput.password || ''),
        lastName: userInput.lastName,
        phone: userInput.phone,
        customers: {
          create: {
            customer: { connect: { id: userInput.customerId || undefined } },
            role: { connect: { id: userInput.roleId || undefined } },
          },
        },
      },
    });
  }

  /**
   * Invites a new user to a current customer, and mails them with a login-token.
   */
  async inviteNewUserToCustomer(email: string, customerId: string, roleId: string) {
    const createdUser = await this.prisma.user.create({
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

    const inviteLoginToken = AuthService.createUserToken(createdUser.id);

    await prisma.user.update({
      where: {
        id: createdUser.id,
      },
      data: {
        loginToken: inviteLoginToken,
      },
    });

    const emailBody = makeInviteTemplate({
      customerName: createdUser.customers[0].customer.name,
      recipientMail: email,
      token: inviteLoginToken,
      bgColor: createdUser.customers[0].customer.settings?.colourSettings?.primary,
    });

    mailService.send({
      recipient: email,
      subject: 'Welcome to HAAS!',
      body: emailBody,
    });
  }

  static async updateUserRole(userId: string, newRoleId: string, workspaceId: string) {
    const updatedUser = await prisma.userOfCustomer.update({
      where: {
        userId_customerId: {
          customerId: workspaceId,
          userId: userId,
        },
      },
      data: {
        role: { connect: { id: newRoleId } },
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
    });

    const emailBody = makeRoleUpdateTemplate({
      customerName: updatedUser.customer.name,
      recipientMail: updatedUser.user.email,
      newRoleName: updatedUser.role.name
    });

    mailService.send({
      recipient: updatedUser.user.email,
      subject: 'HAAS: New role assigned to you.',
      body: emailBody,
    });
  }

  static async inviteExistingUserToCustomer(userId: string, newRoleId: string, workspaceId: string) {
    const invitedUser = await prisma.userOfCustomer.create({
      data: {
        customer: { connect: { id: workspaceId } },
        role: { connect: { id: newRoleId } },
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

    const inviteLoginToken = AuthService.createUserToken(userId);

    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        loginToken: inviteLoginToken,
      },
    });

    const emailBody = makeInviteTemplate({
      customerName: invitedUser.customer.name,
      recipientMail: invitedUser.user.email,
      token: inviteLoginToken,
      bgColor: invitedUser.customer.settings?.colourSettings?.primary,
    });

    mailService.send({
      recipient: invitedUser.user.email,
      subject: `HAAS: You have been invited to ${invitedUser.customer.name}`,
      body: emailBody,
    });
  }


  static filterBySearchTerm = (
    usersOfCustomer: (UserOfCustomer & {
      user: {
        firstName: string;
        lastName: string;
        email: string;
      },
      role: {
        name: string;
      };
    })[],
    searchTerm: string | null | undefined,
  ) => {
    if (!searchTerm) return usersOfCustomer;

    const filtered = usersOfCustomer.filter((userOfCustomer) => {
      if (userOfCustomer?.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())) {
        return true;
      }
      if (userOfCustomer?.user?.firstName?.toLowerCase().includes(searchTerm.toLowerCase())) {
        return true;
      }
      if (userOfCustomer?.user?.lastName?.toLowerCase().includes(searchTerm.toLowerCase())) {
        return true;
      }
      if (userOfCustomer?.role?.name?.toLowerCase().includes(searchTerm.toLowerCase())) {
        return true;
      }
      return false;
    });

    return filtered;
  };

  static orderUsersBy = (
    usersOfCustomer: (UserOfCustomer & {
      user: {
        firstName: string;
        lastName: string;
        email: string;
      },
      role: {
        name: string;
      };
    })[],
    orderBy: any,
  ) => {
    if (orderBy.by === 'firstName') {
      return _.orderBy(usersOfCustomer, (userOfCustomer) => userOfCustomer.user.firstName, orderBy.desc ? 'desc' : 'asc');
    } if (orderBy.by === 'lastName') {
      return _.orderBy(usersOfCustomer, (userOfCustomer) => userOfCustomer.user.lastName, orderBy.desc ? 'desc' : 'asc');
    } if (orderBy.by === 'email') {
      return _.orderBy(usersOfCustomer, (userOfCustomer) => userOfCustomer.user.email, orderBy.desc ? 'desc' : 'asc');
    } if (orderBy.by === 'role') {
      return _.orderBy(usersOfCustomer, (userOfCustomer) => userOfCustomer.role.name, orderBy.desc ? 'desc' : 'asc');
    }

    return usersOfCustomer;
  };

  static paginatedUsers = async (
    customerSlug: string,
    paginationOpts: NexusGenInputs['PaginationWhereInput'],
  ) => {
    const userOfCustomerFindManyArgs: FindManyUserOfCustomerArgs = {
      where: {
        customer: { slug: customerSlug },
      },
      include: {
        customer: true,
        role: true,
        user: true,
      },
    };

    const countWhereInput: FindManyUserOfCustomerArgs = {
      where: {
        customer: { slug: customerSlug },
      }
    };

    const findManyUsers = async ({ props, paginationOpts }: FindManyCallBackProps) => {
      const users: any = await prisma.userOfCustomer.findMany(props);
      const filteredBySearch = UserService.filterBySearchTerm(users, paginationOpts?.searchTerm);
      const orderedUsers = UserService.orderUsersBy(filteredBySearch, paginationOpts?.orderBy?.[0]);
      return orderedUsers;
    };
    const countUsers = async ({ props: countArgs }: FindManyCallBackProps) => prisma.userOfCustomer.count(countArgs);

    const paginateProps: PaginateProps = {
      findManyArgs: {
        findArgs: userOfCustomerFindManyArgs,
        searchFields: [],
        orderFields: [],
        findManyCallBack: findManyUsers,
      },
      countArgs: {
        countWhereInput,
        countCallBack: countUsers,
      },
      paginationOpts,
    };

    const { entries, pageInfo } = await paginate(paginateProps);

    return {
      userCustomers: entries,
      offset: paginationOpts?.offset || 0,
      limit: paginationOpts?.limit || 0,
      startDate: paginationOpts?.startDate?.toString(),
      endDate: paginationOpts?.endDate?.toString(),
      pageInfo,
    };
  };
}

export default UserService;
