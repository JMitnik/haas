import { extendType, inputObjectType, objectType } from '@nexus/schema';

import { UserInputError } from 'apollo-server-express';
import { PaginationWhereInput } from '../general/Pagination';
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

    t.string('roleId', { nullable: true });
    t.field('role', {
      type: RoleType,
      nullable: true,

      async resolve(parent, args, ctx, info) {
        const userWithRole = await ctx.prisma.user.findOne({
          where: { id: parent.id || undefined },
          include: {
            customers: {
              include: {
                role: true,
                customer: true,
              },
            },
          },
        });

        const userCustomer = userWithRole?.customers.find((cus) => cus.customer.slug === info.variableValues.customerSlug);

        return userCustomer?.role;
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
    t.string('email', { required: true });
    t.string('firstName', { nullable: true });
    t.string('password');
    t.string('roleId');
    t.string('customerId', { nullable: true });
    t.string('lastName', { nullable: true });
    t.string('phone', { nullable: true });
  },
});

export const UserQueries = extendType({
  type: 'Query',
  definition(t) {
    t.field('userTable', {
      type: UserTable,
      args: { customerSlug: 'String', filter: PaginationWhereInput },
      nullable: true,

      async resolve(parent, args) {
        if (!args.customerSlug) return null;
        if (!args.filter) return null;

        return UserService.paginatedUsers(
          args.customerSlug,
          args.filter?.pageIndex,
          args.filter?.offset,
          args.filter?.limit,
          args.filter?.orderBy?.[0],
          args.filter?.searchTerm,
        );

        // const users = await ctx.prisma.user.findMany({ where: { Customer: {
        //   slug: args.customerSlug,
        // } } });

        // TODO: Return this
        // const totalPages = Math.ceil(users.length / (args.filter?.limit || 1));
        // const totalPages = 1;

        // return { users, pageIndex, totalPages };
      },
    });

    t.list.field('users', {
      type: UserType,
      args: { customerSlug: 'String' },

      resolve(parent, args, ctx) {
        if (!args.customerSlug) throw new UserInputError('No business provided');
        return ctx.prisma.user.findMany({ where: { customers: {
          every: { customer: { slug: args.customerSlug || undefined } },
        } } });
      },
    });

    t.field('user', {
      type: UserType,
      args: { userId: 'String' },
      nullable: true,

      async resolve(parent, args, ctx) {
        if (!args.userId) throw new UserInputError('No valid user id provided');

        const user = await ctx.prisma.user.findOne({ where: { id: args.userId } });

        if (!user) throw new UserInputError('Cant find user with this ID');
        return user || null;
      },
    });
  },
});

export const UserMutations = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('createUser', {
      type: UserType,
      args: { customerSlug: 'String', input: UserInput },

      resolve(parent, args, ctx) {
        if (!args.customerSlug) throw new UserInputError('No customer scope provided');
        if (!args.input) throw new UserInputError('No input provided');

        const { firstName, lastName, email, password, phone, roleId } = args.input;

        if (!email) throw new UserInputError('No valid email provided');
        // if (!password) throw new UserInputError('No password provided');

        return ctx.prisma.user.create({
          data: {
            email,
            firstName,
            password: (password || ''),
            lastName,
            phone,
            customers: {
              create: {
                customer: { connect: { id: args.input.customerId || undefined } },
                role: { connect: { id: roleId || undefined } },
              },
            },
          },
        });
      },
    });

    t.field('editUser', {
      type: UserType,
      args: { id: 'String', input: UserInput },

      resolve(parent, args, ctx) {
        if (!args.id) throw new UserInputError('No valid user provided to edit');
        if (!args.input) throw new UserInputError('No input provided');
        const { firstName, lastName, email, phone, roleId } = args.input;

        if (!email) throw new UserInputError('No valid email provided');

        // TODO: Check if user exists?

        return ctx.prisma.user.update({
          where: {
            id: args.id,
          },
          data: {
            firstName,
            lastName,
            phone,
            email,
          },
        });
      },
    });

    t.field('deleteUser', {
      type: UserType,
      args: { id: 'String' },
      resolve(parent, args, ctx) {
        if (!args.id) throw new UserInputError('No valid user provided to delete');

        return ctx.prisma.user.delete({ where: { id: args.id } });
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
