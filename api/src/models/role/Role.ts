import { PrismaClient } from '@prisma/client';
import { extendType, inputObjectType, objectType } from '@nexus/schema';

// eslint-disable-next-line import/no-cycle
import { CustomerType } from '../customer/Customer';
// eslint-disable-next-line import/no-cycle
import { PaginationProps } from '../../types/generic';
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
      async resolve(parent, args: any, ctx: any) {
        const { prisma }: { prisma: PrismaClient } = ctx;

        const customerPermissions = await prisma.permission.findMany({
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
        const { prisma } = ctx;

        if (!parent.customerId) {
          return null;
        }

        const customer = await prisma.customer.findOne({
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

export const RoleTableType = objectType({
  name: 'RoleTableType',
  definition(t) {
    t.int('pageIndex', { nullable: true });
    t.int('totalPages', { nullable: true });

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
    t.field('roleTable', {
      type: RoleTableType,
      args: {
        customerId: 'String',
        filter: PaginationWhereInput,
      },

      async resolve(parent: any, args: any, ctx: any) {
        const { prisma }: { prisma: PrismaClient } = ctx;
        const { pageIndex, offset, limit }: PaginationProps = args.filter;
        const { roles, totalPages, newPageIndex } = await RoleService.paginatedRoles(
          args.customerId, pageIndex, offset, limit,
        );

        const permissions = await prisma.permission.findMany({ where: { customerId: args.customerId } });
        return { roles, permissions, pageIndex: newPageIndex || pageIndex, totalPages: totalPages || 1 };
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
      async resolve(parent: any, args: any, ctx: any) {
        const { prisma }: { prisma: PrismaClient } = ctx;
        const { name, customerId } = args.data;

        return prisma.role.create({
          data: {
            name,
            permissions: {
              create: [],
            },
            Customer: {
              connect: {
                id: customerId,
              },
            },
          },
        });
      },
    });

    t.field('updateRoles', {
      type: RoleType,
      args: { roleId: 'String', permissions: PermissionIdsInput },
      async resolve(parent: any, args: any, ctx: any) {
        const { prisma }: { prisma: PrismaClient } = ctx;
        const { roleId, permissions } = args;
        const { ids }: { ids: Array<string> } = permissions;

        const updateRole = await prisma.role.update({
          where: {
            id: roleId,
          },
          data: {
            permissions: {
              connect: ids.map((id) => ({ id })),
            },
          },
        });

        return updateRole;
      },
    });
  },
});

export default [
  RoleTableType,
  RoleQueries,
  RoleDataInput,
  RoleInput,
  RoleMutations,
  RoleType,
];
