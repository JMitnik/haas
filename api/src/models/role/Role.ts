import { extendType, inputObjectType, objectType } from '@nexus/schema';

// eslint-disable-next-line import/no-cycle
import { CustomerType } from '../customer/Customer';
// eslint-disable-next-line import/no-cycle
import { PaginationWhereInput } from '../general/Pagination';
import { PermissionType } from '../permission/Permission';
import RoleService from './RoleService';

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
      type: PermissionType,

      async resolve(parent, args, ctx) {
        const customerPermissions = await ctx.prisma.permission.findMany({
          where: { customerId: parent.customerId },
          include: {
            isPermissionOfRole: {
              select: {
                id: true,
              },
            },
          },
        });

        const activePermissions = customerPermissions.filter((permission) => {
          const activeRoleIds = permission.isPermissionOfRole.map((role) => role.id);
          return activeRoleIds.includes(parent.id);
        });

        return activePermissions;
      },
    });

    t.field('customer', {
      type: CustomerType,
      nullable: true,

      async resolve(parent, args, ctx) {
        if (!parent.customerId) return null;

        const customer = await ctx.prisma.customer.findOne({
          where: { id: parent.customerId },
        });

        return customer;
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
  },
});

// TODO: Implement Pagination Interface
export const RoleConnection = objectType({
  name: 'RoleConnection',
  definition(t) {
    t.implements('ConnectionInterface');
    t.list.field('roles', {
      type: RoleType,
    });

    t.list.field('permissions', {
      type: PermissionType,
    });
  },
});

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
        if (!args.customerId) return null;

        const { roles, pageInfo } = await RoleService.paginatedRoles(args.customerId, {
          limit: args.filter?.limit,
          pageIndex: args.filter?.pageIndex,
          offset: args.filter?.offset,
        });

        const permissions: any = await ctx.prisma.permission.findMany({ where: { customerId: args.customerId } });

        const roleConnection: any = { roles, permissions, pageIndex: pageInfo.pageIndex, totalPages: pageInfo.nrPages };

        return roleConnection;
      },
    });

    t.list.field('roles', {
      type: RoleType,
      args: { customerSlug: 'String' },
      nullable: true,

      async resolve(parent, args) {
        if (!args.customerSlug) {
          return [];
        }

        const roles = await RoleService.roles(args.customerSlug);

        if (!roles) {
          return [];
        }

        return roles;
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

        return ctx.prisma.role.create({
          data: {
            name: args.data.name,
            permissions: {
              create: [],
            },
            Customer: {
              connect: {
                id: args.data.customerId,
              },
            },
          },
        });
      },
    });

    t.field('updateRoles', {
      type: RoleType,
      args: { roleId: 'String', permissions: PermissionIdsInput },
      async resolve(parent, args, ctx) {
        if (!args.roleId) {
          throw new Error('No role provided');
        }

        const updateRole = await ctx.prisma.role.update({
          where: {
            id: args.roleId,
          },
          data: {
            permissions: {
              // TODO: Will this set permission array to [] if no permissions are provided?
              connect: args.permissions?.ids?.map((id) => ({ id })) || [],
            },
          },
        });

        return updateRole;
      },
    });
  },
});

export default [
  RoleConnection,
  RoleQueries,
  RoleDataInput,
  RoleInput,
  RoleMutations,
  RoleType,
];
