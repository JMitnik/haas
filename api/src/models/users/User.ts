import { NodeEntry, NodeEntryValue, NodeEntryWhereInput, PrismaClient, Session, SessionWhereInput } from '@prisma/client';
import { extendType, inputObjectType, objectType } from '@nexus/schema';
import _ from 'lodash';

const prisma = new PrismaClient();

export const PermissionType = objectType({
  name: 'PermssionType',
  definition(t) {
    t.id('id');
    t.string('name');
    t.string('description', { nullable: true });
  },
});

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

export const UserType = objectType({
  name: 'UserType',
  definition(t) {
    t.id('id');
    t.string('email');
    t.string('firstName', { nullable: true });
    t.string('lastName', { nullable: true });
    t.field('role', {
      type: RoleType,
    });
  },
});

export const UserQueries = extendType({
  type: 'Query',
  definition(t) {
    t.list.field('users', {
      type: UserType,
      args: { customerId: 'String' },
      resolve(parent: any, args: any, ctx: any) {
        return prisma.user.findMany({ where: { customerId: args.customerId } });
      },
    });
  },
});


export const UserDataInput = inputObjectType({
    name: 'UserDataInput',
    definition(t) {
        t.string('firstName', {nullable: true});
        t.string('lastName', {nullable: true });
        t.string('email');
        t.string('password', { nullable: true });
        t.string('phone', { nullable: true });
        // TODO: Add role here (?)
    }
})

export const UserInput = inputObjectType({
  name: 'UserInput',
  definition(t) {
    t.string('customerId');
    t.field('data', {
        type: UserDataInput,
    })
  },
});

export const UserMutations = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('createUser', {
      type: UserType,
      args: {

      }
      resolve(parent: any, args: any, ctx: any) {

      },
    });
  },
});

const userNexus = [
  UserQueries,
  UserMutations,
  PermissionType,
  RoleType,
  UserType,
];

export default userNexus;
