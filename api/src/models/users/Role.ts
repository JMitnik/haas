import { PrismaClient, Role } from '@prisma/client';
import { extendType, inputObjectType, objectType } from '@nexus/schema';

import { CustomerType } from '../customer/Customer';
import { PermissionType } from './Permission';

const prisma = new PrismaClient();

export const RoleType = objectType({
  name: 'RoleType',
  definition(t) {
    t.id('id');
    t.string('name');
    t.list.field('permissions', {
      type: PermissionType,
      async resolve(parent: Role, args: any, ctx: any) {
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
    t.int('amtPermissions');
    t.field('customer', {
      type: CustomerType,
      resolve(parent: Role, args: any, ctx: any) {
        return prisma.customer.findOne({ where: { id: parent.customerId } });
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

export const RoleQueries = extendType({
  type: 'Query',
  definition(t) {
    t.list.field('roles', {
      type: RoleType,
      args: { customerId: 'String' },
      async resolve(parent: any, args: any, ctx: any) {
        const roles = await prisma.role.findMany({
          where: { customerId: args.customerId },
          include: {
            permissions: true,
          },
        });
        const mappedRoles = roles.map((role) => ({ ...role, amtPermissions: role.permissions.length }));
        return mappedRoles;
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
      resolve(parent: any, args: any, ctx: any) {
        const { name, description, customerId } = args.data;
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

const roleNexus = [
  RoleQueries,
  RoleDataInput,
  RoleInput,
  RoleMutations,
  RoleType,
];

export default roleNexus;
