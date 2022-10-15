import { ApolloError, UserInputError } from 'apollo-server-express';
import { extendType, inputObjectType, mutationField, objectType, queryField, scalarType } from 'nexus';
import { Prisma } from 'prisma/prisma-client';
import { Kind } from 'graphql';

import { ConnectionInterface } from '../../general/Pagination';
import { RoleType, SystemPermission } from '../../role/graphql/Role';
import { Tour } from '../../../models/UserTour';

export const UserCustomerType = objectType({
  name: 'UserCustomer',

  definition(t) {
    t.date('createdAt', { nullable: false });
    t.boolean('isActive');
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
    t.string('workspaceId', { required: false });
  },
});

export const UserOfCustomerQuery = queryField('UserOfCustomer', {
  type: UserCustomerType,
  args: { input: UserOfCustomerInput },
  nullable: true,

  async resolve(parent, args, ctx) {
    if (!args.input?.userId) throw new UserInputError('User not provided');
    if (!args.input?.customerId && !args.input?.customerSlug) throw new UserInputError('Neither slug nor id of Customer was provided');

    return ctx.services.userService.getUserOfCustomer(
      args.input.customerId,
      args.input.customerSlug,
      args.input.userId
    );
  },
});

export const DateScalar = scalarType({
  name: 'Date',
  asNexusMethod: 'date',
  description: 'Date custom scalar type',
  parseValue(value: any) {
    return new Date(value);
  },
  serialize(value: any) {
    return value.getTime();
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.INT) {
      return new Date(ast.value);
    }
    return null;
  },
});

export const AssignedDialogues = objectType({
  name: 'AssignedDialogues',
  definition(t) {
    t.list.field('privateWorkspaceDialogues', {
      type: 'Dialogue',
      required: true,
    });
    t.list.field('assignedDialogues', {
      type: 'Dialogue',
      required: true,
    });
  },
})

export const UserType = objectType({
  name: 'UserType',
  definition(t) {
    t.nonNull.id('id');
    t.string('email');
    t.string('phone', { nullable: true });
    t.string('firstName', { nullable: true });
    t.string('lastName', { nullable: true });
    t.date('lastLoggedIn', { nullable: true });
    t.date('lastActivity', { nullable: true });

    t.field('assignedDialogues', {
      type: AssignedDialogues,
      nullable: true,
      args: { input: UserOfCustomerInput },
      async resolve(parent, args, ctx) {
        // @ts-ignore
        if (parent.privateDialogues) return parent.privateDialogues;
        // @ts-ignore
        if (!parent.id) return null;
        // @ts-ignore
        if (!args.input?.workspaceId && !args.input?.customerId && !args.input?.customerSlug) return null;

        return ctx.services.userService.findPrivateDialoguesOfUser(args.input, parent.id);
      },
    })

    t.list.field('globalPermissions', {
      nullable: true,
      type: SystemPermission,

      async resolve(parent, args, ctx) {
        if (!parent.id) return null;

        return ctx.services.userService.getGlobalPermissions(parent.id);
      },
    });

    t.field('tours', {
      type: Tour,
      async resolve(parent, args, ctx) {
        if (!parent.id) return null;

        const tours = await ctx.services.userTourService.findUserTours(parent.id);
        return tours.toGraphQL();
      },
    });


    t.list.field('userCustomers', {
      type: UserCustomerType,

      async resolve(parent, args, ctx) {
        if (!parent.id) return null;

        return ctx.services.userService.getUserCustomers(parent.id);
      },
    });

    t.list.field('customers', {
      type: 'Customer',

      async resolve(parent, args, ctx) {
        if (!parent.id) return null;

        return ctx.services.userService.findActiveWorkspacesOfUser(parent.id);
      },
    });

    t.string('roleId', { nullable: true });
    t.field('role', {
      type: RoleType,
      nullable: true,

      async resolve(parent, args, ctx, info) {
        if (!parent.id) return null;
        return ctx.services.userService.getRoleOfWorkspaceUser(parent.id, info.variableValues.customerSlug as string);
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

export const HandleUserStateInWorkspaceInput = inputObjectType({
  name: 'HandleUserStateInWorkspaceInput',
  definition(t) {
    t.string('userId');
    t.string('workspaceId');
    t.boolean('isActive')
  },
})

export const HandleUserStateInWorkspace = mutationField('handleUserStateInWorkspace', {
  type: UserCustomerType,
  args: { input: HandleUserStateInWorkspaceInput },
  async resolve(parent, args, ctx) {
    if (!args?.input?.userId) throw new UserInputError('No valid user provided to edit');
    if (args?.input?.isActive === undefined || args?.input?.isActive === null || typeof args?.input?.isActive === undefined) throw new UserInputError('No activity state provided');
    if (!args?.input?.workspaceId) throw new UserInputError('No workspace Id provided');

    const input = { userId: args.input.userId, isActive: args.input.isActive, workspaceId: args.input.workspaceId }
    return ctx.services.userService.setUserStateInWorkspace(input);
  },
})

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
