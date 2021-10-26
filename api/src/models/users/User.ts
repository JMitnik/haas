import { ApolloError, UserInputError } from 'apollo-server-express';
import { extendType, inputObjectType, objectType, queryField, scalarType } from '@nexus/schema';
import { Prisma } from '@prisma/client';
import { Kind } from 'graphql';

import { ConnectionInterface, DeprecatedConnectionInterface } from '../general/Pagination';
import { RoleType, SystemPermission } from '../role/Role';

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

    return ctx.services.userService.getUserOfCustomer(args.input.customerId, args.input.customerSlug, args.input.userId);
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

    t.list.field('globalPermissions', {
      nullable: true,
      type: SystemPermission,

      async resolve(parent, args, ctx) {
        return ctx.services.userService.getGlobalPermissions(parent.id);
      },
    });

    t.list.field('userCustomers', {
      type: UserCustomerType,

      async resolve(parent, args, ctx) {
        return ctx.services.userService.getUserCustomers(parent.id);
      },
    });

    t.list.field('customers', {
      type: 'Customer',

      async resolve(parent, args, ctx) {
        return ctx.services.userService.getCustomersOfUser(parent.id);
      },
    });

    t.string('roleId', { nullable: true });
    t.field('role', {
      type: RoleType,
      nullable: true,

      async resolve(parent, args, ctx, info) {
        return ctx.services.userService.getRoleOfWorkspaceUser(parent.id, info.variableValues.customerSlug);
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

        const user = await ctx.services.userService.findUserContext(userId);

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
        return ctx.services.userService.getAllUsersByCustomerSlug(args.customerSlug);
      },
    });

    t.field('user', {
      type: UserType,
      args: { userId: 'String' },
      nullable: true,

      async resolve(parent, args, ctx) {
        if (!args.userId) throw new UserInputError('No valid user id provided');

        const user = await ctx.services.userService.findUserContext(args.userId);

        if (!user) throw new UserInputError('Cant find user with this ID');
        return user || null;
      },
    });
  },
});

export const UserMutations = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('editUser', {
      type: UserType,
      args: { userId: 'String', input: EditUserInput },

      async resolve(parent, args, ctx) {
        if (!args.userId) throw new UserInputError('No valid user provided to edit');
        if (!args.input) throw new UserInputError('No input provided');
        const { firstName, lastName, email, phone, roleId } = args.input;
        const userUpdateInput: Prisma.UserUpdateInput = { firstName, lastName, phone, email };

        return ctx.services.userService.editUser(userUpdateInput, email, args.userId, args.input.customerId, roleId);
      },
    });

    t.field('deleteUser', {
      type: DeleteUserOuput,
      args: { input: DeleteUserInput },
      async resolve(parent, args, ctx) {
        if (!args.input?.customerId) throw new UserInputError('No workspace provided');
        if (!args.input?.userId) throw new UserInputError('No user provided');

        return ctx.services.userService.deleteUser(args.input.userId, args.input.customerId);
      },
    });
  },
});
