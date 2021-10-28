import { enumType, extendType, inputObjectType, objectType, queryField } from '@nexus/schema';
import { UserInputError } from 'apollo-server-express';

import { PaginationWhereInput } from '../general/Pagination';
import { SystemPermissions } from './Permissions';

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

    t.list.field('permissions', {
      nullable: true,
      type: SystemPermission,

      async resolve(parent, args, ctx) {
        const permissions = await ctx.services.roleService.getPermissionsByRoleId(parent.id);
        return permissions;
      },
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
  },
});

export const FindRoleByIdResolver = queryField('findRoleById', {
  type: RoleType,
  nullable: true,
  args: { input: FindRoleInput },
  resolve(parent, args, ctx) {
    if (!args.input?.roleId) throw new UserInputError('No RoleId provided!');
    return ctx.services.roleService.findRoleById(args.input.roleId);
  }
})


export const RoleQueries = extendType({
  type: 'Query',
  definition(t) {
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

export const RoleMutations = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('createRole', {
      type: RoleType,
      args: { data: RoleInput },

      async resolve(parent, args, ctx) {
        if (!args.data?.customerId) {
          throw new Error('Invalid customer id provided');
        }

        if (!args.data?.name) {
          throw new Error('No role name provided');
        }

        // Rudimentary
        return ctx.services.roleService.createRole(args.data.customerId, args.data.name);
      },
    });

    t.field('updateRoles', {
      type: RoleType,
      args: { roleId: 'String', permissions: PermissionIdsInput },
      async resolve(parent, args, ctx) {
        if (!args.roleId) {
          throw new Error('No role provided');
        }

        // TODO: Set to appropriate logic
        const updateRole = await ctx.services.roleService.updatePermissions(args.roleId, []);

        return updateRole;
      },
    });
  },
});

export default [
  FindRoleInput,
  FindRoleByIdResolver,
  RoleConnection,
  RoleQueries,
  RoleDataInput,
  RoleInput,
  RoleMutations,
  RoleType,
];
