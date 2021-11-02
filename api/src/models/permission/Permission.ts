import { extendType, inputObjectType, objectType } from '@nexus/schema';
import { SystemPermissionEnum } from '@prisma/client';
import { UserInputError } from 'apollo-server-express';

import { CustomerType } from '../customer/Customer';
import { SystemPermission } from '../role/Role';
import PermissionService, { CreatePermissionInput } from './PermissionService';

export const PermissionType = objectType({
  name: 'PermssionType',

  definition(t) {
    t.string('name');
    t.string('description', { nullable: true });
    t.boolean('isEnabled');

    t.field('customer', { type: CustomerType, nullable: true });
    t.field('type', { type: SystemPermission })
  },
});

export const PermissionInput = inputObjectType({
  name: 'PermissionInput',

  definition(t) {
    t.string('customerId');
    t.string('name');
    t.string('description', { nullable: true });

    t.field('type', { type: SystemPermission });
  },
});

export const PermissionMutations = extendType({
  type: 'Mutation',

  definition(t) {
    t.field('createPermission', {
      type: PermissionType,
      args: { input: PermissionInput },
      nullable: true,

      async resolve(parent, args, ctx) {
        if (!args.input?.name || !args.input?.customerId || !args.input?.type) {
          throw new UserInputError('Name and/or customerID not valid!');
        };

        const createPermissionInput: CreatePermissionInput = {
          customerId: args?.input.customerId,
          name: args?.input.name,
          description: args?.input?.description,
          type: args?.input?.type
        };

        const permission = await ctx.services.permissionService.createPermission(createPermissionInput);

        return permission || null;
      },
    });
  },
});

export default [
  PermissionMutations,
  PermissionInput,
  PermissionType,
];
