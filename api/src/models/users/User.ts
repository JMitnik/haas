import { NodeEntry, NodeEntryValue, NodeEntryWhereInput, PrismaClient, Session, SessionWhereInput, User } from '@prisma/client';
import { extendType, inputObjectType, objectType } from '@nexus/schema';
import { PermissionType } from './Permission';
import { RoleType } from './Role';
import _ from 'lodash';

const prisma = new PrismaClient();

export const UserType = objectType({
  name: 'UserType',
  definition(t) {
    t.id('id');
    t.string('email');
    t.string('phone', { nullable: true });
    t.string('firstName', { nullable: true });
    t.string('lastName', { nullable: true });
    t.field('role', {
      type: RoleType,
      resolve(parent: User, args: any, ctx: any) {
        return prisma.role.findOne({ where: { id: parent.roleId } });
      },
    });
  },
});

export const UserInput = inputObjectType({
  name: 'UserInput',
  definition(t) {
    t.string('customerId', { nullable: true });
    t.string('firstName', { nullable: true });
    t.string('lastName', { nullable: true });
    t.string('email');
    t.string('password', { nullable: true });
    t.string('phone', { nullable: true });
    t.string('roleId');
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
    t.field('user', {
      type: UserType,
      args: { userId: 'String' },
      resolve(parent: any, args: any, ctx: any) {
        return prisma.user.findOne({ where: { id: args.userId } });
      },
    });
  },
});

export const UserMutations = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('createUser', {
      type: UserType,
      args: { data: UserInput },
      resolve(parent: any, args: any, ctx: any) {
        const { firstName, lastName, email, password, phone, roleId, customerId } = args.data;
        return prisma.user.create({
          data: {
            email,
            firstName,
            lastName,
            phone,
            role: {
              connect: {
                id: roleId,
              },
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
    t.field('editUser', {
      type: UserType,
      args: { id: 'String', input: UserInput },
      resolve(parent: any, args: any, ctx) {
        const { firstName, lastName, email, password, phone, roleId, customerId } = args.input;
        // TODO: Update potential role change
        return prisma.user.update({
          where: {
            id: args.id,
          },
          data: {
            firstName,
            lastName,
            phone,
            email,
            role: {
              connect: {
                id: roleId,
              },
            },
          },
        });
      },
    });
    t.field('deleteUser', {
      type: UserType,
      args: { id: 'String' },
      resolve(parent: any, args: any, ctx) {
        console.log('ARGS:', args);
        return prisma.user.delete({ where: { id: args.id } });
      },
    });
  },
});

const userNexus = [
  UserInput,
  UserQueries,
  UserMutations,
  UserType,
];

export default userNexus;
