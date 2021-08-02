import { ApolloError, UserInputError } from 'apollo-server-express';
import { differenceInMinutes } from 'date-fns';
import { extendType, inputObjectType, objectType, queryField, scalarType } from '@nexus/schema';

import { ConnectionInterface, PaginationWhereInput } from '../general/Pagination';
import { Kind } from 'graphql';
import { RoleType, SystemPermission } from '../role/Role';
import UserService from './UserService';

export const UserCustomerType = objectType({
  name: 'UserCustomer',

  definition(t) {
    t.field('user', { type: 'UserType' });
    t.field('customer', { type: 'Customer' });
    t.field('role', { type: 'RoleType' });
  },
});

export const UserOfCustomerInput = inputObjectType({
  name: 'UserOfCustomerInput',
  definition(t) {
    t.string('userId');

    // Provide one of the two
    t.string('customerId', { required: false });
    t.string('customerSlug', { required: false });
  },
});

export const UserOfCustomerQuery = queryField('UserOfCustomer', {
  type: UserCustomerType,
  args: { input: UserOfCustomerInput },
  nullable: true,

  async resolve(parent, args, ctx) {
    if (!args.input?.userId) throw new UserInputError('User not provided');
    if (!args.input?.customerId && !args.input?.customerSlug) throw new UserInputError('Neither slug nor id of Customer was provided');

    let customerId = '';
    if (!args.input?.customerId && args.input?.customerSlug) {
      const customer = await ctx.prisma.customer.findUnique({
        where: { slug: args.input.customerSlug },
      });
      customerId = customer?.id || '';
    } else {
      customerId = args.input.customerId || '';
    }

    const userWithCustomer = await ctx.prisma.userOfCustomer.findUnique({
      where: {
        userId_customerId: {
          customerId,
          userId: args.input.userId,
        },
      },
      include: {
        customer: true,
        role: true,
        user: true,
      },
    });

    if (!userWithCustomer) return null;

    return userWithCustomer;
  },
});

export const DateScalar = scalarType({
  name: 'Date',
  asNexusMethod: 'date',
  description: 'Date custom scalar type',
  parseValue(value) {
    return new Date(value);
  },
  serialize(value) {
    return value.getTime();
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.INT) {
      return new Date(ast.value);
    }
    return null;
  },
});

export const UserType = objectType({
  name: 'UserType',
  definition(t) {
    t.id('id');
    t.string('email');
    t.string('phone', { nullable: true });
    t.string('firstName', { nullable: true });
    t.string('lastName', { nullable: true });

    // t.boolean('isOnline', {
    //   resolve(parent, args, ctx) {
    //     if (!parent.lastActivity) return false;
    //     const minutesSinceOnline = differenceInMinutes(new Date(parent.lastActivity), Date.now());

    //     if (minutesSinceOnline > 5) {
    //       return true;
    //     }

    //     return false;
    //   },
    // });

    t.list.field('globalPermissions', {
      nullable: true,
      type: SystemPermission,

      async resolve(parent, args, ctx) {
        const user = await ctx.prisma.user.findUnique({
          where: { id: parent.id },
        });

        return user?.globalPermissions as any;
      },
    });

    t.list.field('userCustomers', {
      type: UserCustomerType,

      async resolve(parent, args, ctx) {
        const userWithCustomers = await ctx.prisma.user.findUnique({
          where: { id: parent.id },
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

        const customers = userWithCustomers?.customers;

        return customers?.map((customerOfUser: any) => ({
          id: '',
          roleId: '',
          createdAt: new Date(),
          customerId: '',
          userId: '',
          customer: customerOfUser.customer,
          role: customerOfUser.role,
          user: parent,
        })) || [];
      },
    });

    t.list.field('customers', {
      type: 'Customer',

      async resolve(parent, args, ctx) {
        const userWithCustomers = await ctx.prisma.user.findUnique({
          where: { id: parent.id },
          include: {
            customers: {
              include: {
                customer: true,
              },
            },
          },
        });

        const customers = userWithCustomers?.customers.map((customerOfUser: any) => customerOfUser.customer);

        return customers || [];
      },
    });

    t.string('roleId', { nullable: true });
    t.field('role', {
      type: RoleType,
      nullable: true,

      async resolve(parent, args, ctx, info) {
        const userWithRole = await ctx.prisma.user.findUnique({
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

        const userCustomer = userWithRole?.customers.find((cus: any) => (
          cus.customer.slug === info.variableValues.customerSlug
        ));

        const role = userCustomer?.role || null;

        return role;
      },
    });
  },
});

export const UserConnection = objectType({
  name: 'UserConnection',
  definition(t) {
    t.implements(ConnectionInterface);
    t.list.field('userCustomers', { type: UserCustomerType });
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

export const EditUserInput = inputObjectType({
  name: 'EditUserInput',

  definition(t) {
    t.string('email', { required: true });
    t.string('roleId');
    t.string('firstName', { nullable: true });
    t.string('customerId', { nullable: true });
    t.string('lastName', { nullable: true });
    t.string('phone', { nullable: true });
  },
});

export const DeleteUserInput = inputObjectType({
  name: 'DeleteUserInput',

  definition(t) {
    t.id('userId');
    t.id('customerId');
  },
});

export const DeleteUserOuput = objectType({
  name: 'DeleteUserOutput',

  definition(t) {
    t.boolean('deletedUser');
  },
});

export const RootUserQueries = extendType({
  type: 'Query',
  definition(t) {
    t.field('me', {
      type: UserType,

      async resolve(parent, args, ctx) {
        if (!ctx.session?.user?.id) throw new ApolloError('No valid user');
        const userId = ctx.session?.user?.id;

        const user = await ctx.prisma.user.findUnique({
          where: { id: userId },
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

        if (!user) throw new ApolloError('There is something wrong in our records. Please contact an admin.', 'UNAUTHENTIC');

        return {
          email: user?.email,
          id: user?.id,
          firstName: user?.firstName,
          lastName: user?.lastName,
          phone: user?.phone,
        };
      },
    });

    t.list.field('users', {
      type: UserType,
      args: { customerSlug: 'String' },

      resolve(parent, args, ctx) {
        if (!args.customerSlug) throw new UserInputError('No business provided');
        return ctx.prisma.user.findMany({
          where: {
            customers: {
              every: { customer: { slug: args.customerSlug || undefined } },
            }
          }
        });
      },
    });
    t.field('user', {
      type: UserType,
      args: { userId: 'String' },
      nullable: true,

      async resolve(parent, args, ctx) {
        if (!args.userId) throw new UserInputError('No valid user id provided');

        const user = await ctx.prisma.user.findUnique({ where: { id: args.userId } });

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

        const { email } = args.input;

        if (!email) throw new UserInputError('No valid email provided');
        return ctx.services.userService.createUser(args.input);
      },
    });

    t.field('editUser', {
      type: UserType,
      args: { userId: 'String', input: EditUserInput },

      async resolve(parent, args, ctx) {
        if (!args.userId) throw new UserInputError('No valid user provided to edit');
        if (!args.input) throw new UserInputError('No input provided');
        const { firstName, lastName, email, phone, roleId } = args.input;

        const otherMails = await ctx.prisma.user.findMany({
          where: {
            AND: {
              email: { equals: email },
              id: { not: args.userId },
            },
          },
        });

        if (otherMails.length) throw new UserInputError('Email is already taken');

        if (!email) throw new UserInputError('No valid email provided');

        if (args.input.customerId) {
          await ctx.prisma.userOfCustomer.update({
            where: {
              userId_customerId: {
                userId: args?.userId,
                customerId: args.input.customerId,
              }
            },
            data: {
              role: {
                connect: {
                  id: roleId || undefined,
                },
              },
            },
          });
        }

        return ctx.prisma.user.update({
          where: {
            id: args.userId,
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
      type: DeleteUserOuput,
      args: { input: DeleteUserInput },
      async resolve(parent, args, ctx) {
        if (!args.input?.customerId) throw new UserInputError('No workspace provided');
        if (!args.input?.userId) throw new UserInputError('No user provided');

        const removedUser = await ctx.prisma.userOfCustomer.delete({
          where: {
            userId_customerId: {
              customerId: args.input.customerId,
              userId: args.input.userId,
            },
          },
        });

        if (removedUser) return { deletedUser: true };

        return { deletedUser: false };
      },
    });
  },
});
