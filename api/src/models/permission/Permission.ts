import { NodeEntry, NodeEntryValue, NodeEntryWhereInput, PrismaClient, Session, SessionWhereInput } from '@prisma/client';
import { extendType, inputObjectType, objectType } from '@nexus/schema';

const prisma = new PrismaClient();

export const PermissionType = objectType({
  name: 'PermssionType',
  definition(t) {
    t.id('id');
    t.string('name');
    t.string('description', { nullable: true });
  },
});

export const PermissionInput = inputObjectType({
  name: 'PermissionInput',
  definition(t) {
    t.string('customerId');
    t.string('name');
    t.string('description', { nullable: true });
  },
});

export const PermissionMutations = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('createPermission', {
      type: PermissionType,
      args: { data: PermissionInput },
      resolve(parent: any, args: any, ctx) {
        const { name, description, customerId } = args.data;
        return prisma.permission.create({
          data: {
            name,
            description,
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

const permissionNexus = [
  PermissionMutations,
  PermissionInput,
  PermissionType,
];

export default permissionNexus;
