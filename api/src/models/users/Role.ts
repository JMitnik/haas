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
      resolve(parent: Role, args: any, ctx: any) {
        return prisma.permission.findMany({ where: { roleId: parent.id } });
      },
    });
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
        const roles = await prisma.role.findMany({ where: { customerId: args.customerId } });
        return roles;
      },
    });
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
