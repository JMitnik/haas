import { enumType, extendType, inputObjectType, mutationField, objectType, queryField } from '@nexus/schema';
import { UserInputError } from 'apollo-server-express';

import { PaginationWhereInput } from '../../general/Pagination';
import { SystemPermissions } from '../Permissions';

export const SystemPermission = enumType({
  name: 'SystemPermission',
  members: SystemPermissions,
});

export const RoleType = objectType({
  name: 'RoleType',

  definition(t) {
    t.id('id');
    t.string('name');
    t.string('roleId', { nullable: true });
    t.string('customerId', { nullable: true });
    t.int('nrPermissions', { nullable: true });

    t.list.field('allPermissions', {
      type: SystemPermission,
      resolve: () => SystemPermissions,
    });

    t.list.field('permissions', {
      nullable: true,
      type: SystemPermission,
    });
  },
});

export const RoleDataInput = inputObjectType({
  name: 'RoleDataInput',
  definition(t) {
    t.string('name');
    t.string('description', { nullable: true });
  },
});

export const RoleInput = inputObjectType({
  name: 'RoleInput',
  definition(t) {
    t.string('customerId');
    t.string('name');
    t.string('description', { nullable: true });
    t.list.field('permissions', { type: SystemPermission });
  },
});

export const RoleConnection = objectType({
  name: 'RoleConnection',
  definition(t) {
    t.implements('DeprecatedConnectionInterface');
    t.list.field('roles', { type: RoleType });
  },
});

export const FindRoleInput = inputObjectType({
  name: 'FindRoleInput',
  definition(t) {
    t.string('roleId');
    t.string('userId');
  },
});

export const RoleQueries = extendType({
  type: 'Query',
  definition(t) {
    t.field('role', {
      type: RoleType,
      nullable: true,
      args: { input: FindRoleInput },
      async resolve(parent, args, ctx) {
        if (!args.input?.roleId) throw new UserInputError('No RoleId provided!');
        if (!args.input?.userId) throw new UserInputError('No UserId provided!');

        const role = await ctx.services.roleService.findRoleById(args.input.roleId, args.input.userId);

        if (!role) throw new UserInputError('Role not found!');

        return role as any;
      }
    });

    t.field('roleConnection', {
      type: RoleConnection,
      args: {
        customerId: 'String',
        filter: PaginationWhereInput,
      },

      async resolve(parent, args, ctx) {
        if (!args.customerId) throw new Error('Customer cant be found');

        const { roles, pageInfo } = await ctx.services.roleService.paginatedRoles(args.customerId, {
          limit: args.filter?.limit,
          pageIndex: args.filter?.pageIndex,
          offset: args.filter?.offset,
        });

        const permissions = await ctx.services.permissionService.getPermissionsOfCustomer(args.customerId);

        return {
          roles,
          permissions,
          pageInfo,
          // TODO: Figure out what to do with these?
          limit: args.filter?.limit || 0,
          offset: args.filter?.offset || 0,
        };
      },
    });
  },
});

export const PermissionIdsInput = inputObjectType({
  name: 'PermissionIdsInput',
  definition(t) {
    t.list.string('ids');
  },
});

export default [
  RoleConnection,
  RoleQueries,
  RoleDataInput,
  RoleInput,
  RoleType,
];
