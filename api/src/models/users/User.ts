import { PrismaClient, User } from '@prisma/client';
import { extendType, inputObjectType, objectType } from '@nexus/schema';
import _ from 'lodash';

import { FilterInput } from '../session/Session';
import { PaginationProps } from '../../types/generic';
import { RoleType } from '../role/Role';
import UserResolver from './user-resolver';

const prisma = new PrismaClient();

export const UserType = objectType({
  name: 'UserType',
  definition(t) {
    t.id('id');
    t.string('email');
    t.string('phone', { nullable: true });
    t.string('firstName', { nullable: true });
    t.string('lastName', { nullable: true });
    t.field('role', {
      type: RoleType,
      resolve(parent: User, args: any, ctx: any) {
        return prisma.role.findOne({ where: { id: parent.roleId } });
      },
    });
  },
});

export const UserTable = objectType({
  name: 'UserTable',
  definition(t) {
    t.list.field('users', { type: UserType });
    t.int('pageIndex', { nullable: true });
    t.int('totalPages', { nullable: true });
  },
});

export const UserInput = inputObjectType({
  name: 'UserInput',
  definition(t) {
    t.string('customerId', { nullable: true });
    t.string('firstName', { nullable: true });
    t.string('lastName', { nullable: true });
    t.string('email');
    t.string('password', { nullable: true });
    t.string('phone', { nullable: true });
    t.string('roleId');
  },
});

export const UserQueries = extendType({
  type: 'Query',
  definition(t) {
    t.field('userTable', {
      type: UserTable,
      args: { customerId: 'String',
        filter: FilterInput },
      async resolve(parent: any, args: any, ctx: any) {
        const { pageIndex, offset, limit, searchTerm, orderBy }: PaginationProps = args.filter;
        if (args.filter) {
          return UserResolver.paginatedUsers(args.customerId, pageIndex, offset, limit, orderBy[0], searchTerm);
        }
        const users = await prisma.user.findMany({ where: { customerId: args.customerId } });
        const totalPages = Math.ceil(users.length / limit);
        return { users, pageIndex, totalPages };
      },
    });
    t.list.field('users', {
      type: UserType,
      args: { customerId: 'String',
        filter: FilterInput },
      resolve(parent: any, args: any, ctx: any) {
        const { pageIndex, offset, limit, searchTerm, orderBy }: PaginationProps = args.filter;
        if (args.filter) {
          console.log('args.customerId', args.customerId);
          console.log('args.filer: ', args.filter);
          return UserResolver.paginatedUsers(args.customerId, pageIndex, offset, limit, orderBy[0], searchTerm);
        }
        return prisma.user.findMany({ where: { customerId: args.customerId } });
      },
    });
    t.field('user', {
      type: UserType,
      args: { userId: 'String' },
      resolve(parent: any, args: any, ctx: any) {
        return prisma.user.findOne({ where: { id: args.userId } });
      },
    });
  },
});

export const UserMutations = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('createUser', {
      type: UserType,
      args: { id: 'String',
        input: UserInput },
      resolve(parent: any, args: any, ctx: any) {
        const { firstName, lastName, email, password, phone, roleId, customerId } = args.input;
        return prisma.user.create({
          data: {
            email,
            firstName,
            lastName,
            phone,
            role: {
              connect: {
                id: roleId,
              },
            },
            Customer: {
              connect: {
                id: args.id,
              },
            },
          },
        });
      },
    });
    t.field('editUser', {
      type: UserType,
      args: { id: 'String', input: UserInput },
      resolve(parent: any, args: any, ctx) {
        const { firstName, lastName, email, password, phone, roleId, customerId } = args.input;
        return prisma.user.update({
          where: {
            id: args.id,
          },
          data: {
            firstName,
            lastName,
            phone,
            email,
            role: {
              connect: {
                id: roleId,
              },
            },
          },
        });
      },
    });
    t.field('deleteUser', {
      type: UserType,
      args: { id: 'String' },
      resolve(parent: any, args: any, ctx) {
        return prisma.user.delete({ where: { id: args.id } });
      },
    });
  },
});

const userNexus = [
  UserInput,
  UserQueries,
  UserMutations,
  UserType,
];

export default userNexus;
