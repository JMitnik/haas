import { PrismaClient, User } from '@prisma/client';
import { extendType, inputObjectType, objectType } from '@nexus/schema';

import { FilterInput } from '../session/Session';
import { PaginationProps } from '../../types/generic';
import { RoleType } from '../role/Role';
import UserService from './UserService';

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
        const { prisma }: { prisma: PrismaClient } = ctx;
        return prisma.role.findOne({ where: { id: parent.roleId } });
      },
    });
  },
});

export const UserTable = objectType({
  name: 'UserTable',
  definition(t) {
    t.int('pageIndex', { nullable: true });
    t.int('totalPages', { nullable: true });

    t.list.field('users', { type: UserType });
  },
});

export const UserInput = inputObjectType({
  name: 'UserInput',
  definition(t) {
    t.string('email');
    t.string('roleId');
    t.string('customerId', { nullable: true });
    t.string('firstName', { nullable: true });
    t.string('lastName', { nullable: true });
    t.string('password', { nullable: true });
    t.string('phone', { nullable: true });
  },
});

export const UserQueries = extendType({
  type: 'Query',
  definition(t) {
    t.field('userTable', {
      type: UserTable,
      args: { customerSlug: 'String', filter: FilterInput },
      async resolve(parent: any, args: any, ctx: any) {
        const { prisma }: { prisma: PrismaClient } = ctx;
        const { pageIndex, offset, limit, searchTerm, orderBy }: PaginationProps = args.filter;

        if (args.filter) {
          return UserService.paginatedUsers(args.customerSlug, pageIndex, offset, limit, orderBy[0], searchTerm);
        }

        const users = await prisma.user.findMany({ where: { Customer: {
          slug: args.customerSlug,
        } } });
        const totalPages = Math.ceil(users.length / limit);

        return { users, pageIndex, totalPages };
      },
    });

    t.list.field('users', {
      type: UserType,
      args: { customerSlug: 'String' },
      resolve(parent: any, args: any, ctx: any) {
        const { prisma }: { prisma: PrismaClient } = ctx;
        return prisma.user.findMany({ where: { Customer: { slug: args.customerSlug } } });
      },
    });

    t.field('user', {
      type: UserType,
      args: { userId: 'String' },
      resolve(parent: any, args: any, ctx: any) {
        const { prisma }: { prisma: PrismaClient } = ctx;
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
      args: { customerSlug: 'String',
        input: UserInput },
      resolve(parent: any, args: any, ctx: any) {
        const { prisma }: { prisma: PrismaClient } = ctx;
        const { firstName, lastName, email, phone, roleId } = args.input;
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
                slug: args.customerSlug,
              },
            },
          },
        });
      },
    });

    t.field('editUser', {
      type: UserType,
      args: { id: 'String', input: UserInput },
      resolve(parent: any, args: any, ctx: any) {
        const { prisma }: { prisma: PrismaClient } = ctx;
        const { firstName, lastName, email, phone, roleId } = args.input;
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
      resolve(parent: any, args: any, ctx: any) {
        const { prisma }: { prisma: PrismaClient } = ctx;
        return prisma.user.delete({ where: { id: args.id } });
      },
    });
  },
});

export default [
  UserInput,
  UserQueries,
  UserMutations,
  UserType,
];
