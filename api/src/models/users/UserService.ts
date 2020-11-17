import { FindManyUserOfCustomerArgs, User, UserOfCustomer } from '@prisma/client';

import _ from 'lodash';
import { NexusGenInputs } from '../../generated/nexus';
import { Nullable } from '../../types/generic';

import { FindManyCallBackProps, PaginateProps, paginate } from '../../utils/table/pagination';
import { mailService } from '../../services/mailings/MailService';

import AuthService from '../auth/AuthService';
import makeInviteTemplate from '../../services/mailings/templates/makeInviteTemplate';
import prisma from '../../config/prisma';

class UserService {
  static async createUser(userInput: NexusGenInputs['UserInput']) {
    // TODO: Connect to multile customers
    const user = await prisma.user.create({
      data: {
        email: userInput.email,
        password: userInput.password || '',
        firstName: userInput.firstName || 'Anonymous',
        lastName: userInput.lastName || 'User',
        phone: userInput.phone || '000',
      },
    });

    return user;
  }

  static async inviteNewUserToCustomer(email: string, customerId: string, roleId: string) {
    const createdUser = await prisma.user.create({
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

  static async inviteExistingUserToCustomer(user: User, customerId: string, roleId: string) {
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
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

    const emailBody = makeInviteTemplate({
      customerName: updatedUser.customers[0].customer.name,
      recipientMail: user.email,
      bgColor: updatedUser.customers[0].customer.settings?.colourSettings?.primary,
    });

    mailService.send({
      recipient: user.email,
      subject: 'HAAS: You have been added to a new workspace!',
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

    const countWhereInput: FindManyUserOfCustomerArgs = { where: {
      customer: { slug: customerSlug },
    } };

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
        searchFields: ['firstName', 'lastName', 'email'],
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
