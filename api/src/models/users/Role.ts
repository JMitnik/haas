import { NodeEntry, NodeEntryValue, NodeEntryWhereInput, PrismaClient, Session, SessionWhereInput } from '@prisma/client';
import { PermissionType } from './Permission';
import { extendType, inputObjectType, objectType } from '@nexus/schema';

const prisma = new PrismaClient();

export const RoleType = objectType({
  name: 'RoleType',
  definition(t) {
    t.id('id');
    t.string('name');
    t.list.field('permissions', {
      type: PermissionType,
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

export const RoleMutations = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('createRole', {
      type: RoleType,
      args: { data: RoleInput },
      resolve(parent: any, args: any, ctx: any) {
        const { name, description } = args.data;
        return prisma.role.create({
          data: {
            name,
            permissions: {
              create: [],
            },
          },
        });
      },
    });
  },
});

const roleNexus = [
  RoleDataInput,
  RoleInput,
  RoleMutations,
  RoleType,
];

export default roleNexus;
