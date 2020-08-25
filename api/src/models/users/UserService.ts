import { User, UserWhereInput } from '@prisma/client';
import _ from 'lodash';

import { NexusGenFieldTypes, NexusGenInputs, NexusGenTypes } from '../../generated/nexus';
import { Nullable } from '../../types/generic';

import prisma from '../../config/prisma';

interface CreateUserOptions {
  customerSlug?: string;
}

class UserService {
  static async createUser(userInput: NexusGenInputs['UserInput'], customerSlug: string) {
    // TODO: Connect to multile customers
    const user = await prisma.user.create({
      data: {
        email: userInput.email,
        password: userInput.password,
        firstName: userInput.firstName || 'Anonymous',
        lastName: userInput.lastName || 'User',
        phone: userInput.phone || '000',
      },
    });

    return user;
  }

  static getSearchTermFilter = (searchTerm: string) => {
    if (!searchTerm) {
      return [];
    }

    const searchTermFilter: UserWhereInput[] = [
      {
        firstName: { contains: searchTerm },
      },
      {
        lastName: { contains: searchTerm },
      },
      {
        email: { contains: searchTerm },
      },
      // TODO: Bring back role search
      // {
      //   role: { name: { contains: searchTerm } },
      // },
    ];

    return searchTermFilter;
  };

  static orderUsersBy = (
    users: (User & {
      role: {
        name: string;
      };
    })[],
    orderBy: { id: string, desc: boolean },
  ) => {
    if (orderBy.id === 'firstName') {
      return _.orderBy(users, (user) => user.firstName, orderBy.desc ? 'desc' : 'asc');
    } if (orderBy.id === 'lastName') {
      return _.orderBy(users, (user) => user.lastName, orderBy.desc ? 'desc' : 'asc');
    } if (orderBy.id === 'email') {
      return _.orderBy(users, (user) => user.email, orderBy.desc ? 'desc' : 'asc');
    } if (orderBy.id === 'role') {
      return _.orderBy(users, (user) => user.role.name, orderBy.desc ? 'desc' : 'asc');
    }

    return users;
  };

  static sliceUsers = (
    entries: Array<any>,
    offset: number,
    limit: number,
    pageIndex: number,
  ) => ((offset + limit) < entries.length
    ? entries.slice(offset, (pageIndex + 1) * limit)
    : entries.slice(offset, entries.length));

  static paginatedUsers = async (
    customerSlug: string,
    pageIndex?: Nullable<number>,
    offset?: Nullable<number>,
    limit?: Nullable<number>,
    orderBy?: Nullable<any>,
    searchTerm?: Nullable<string>,
  ) => {
    let needPageReset = false;
    const userWhereInput: UserWhereInput = { customers: { every: { AND: { customer: { slug: customerSlug } } } } };
    const searchTermFilter = UserService.getSearchTermFilter(searchTerm || '');

    if (searchTermFilter.length > 0) {
      userWhereInput.OR = searchTermFilter;
    }

    // Search term filtered users
    const users = await prisma.user.findMany({
      where: userWhereInput,
      include: {
        customers: {
          include: {
            role: true,
          },
        },
      },
    });

    const totalPages = Math.ceil(users.length / (limit || 1));

    if (pageIndex && pageIndex + 1 > totalPages) {
      offset = 0;
      needPageReset = true;
    }
    // Order filtered users
    // TODO: Brign it back
    // const orderedUsers = UserService.orderUsersBy(users, orderBy);

    // Slice ordered filtered users
    const slicedOrderedUsers = UserService.sliceUsers(users, (offset || 0), (limit || 0), (pageIndex || 0));

    return {
      users: slicedOrderedUsers,
      pageIndex: needPageReset ? 0 : pageIndex,
      totalPages,
    };
  };
}

export default UserService;
