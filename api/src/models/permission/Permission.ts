import { extendType, inputObjectType, objectType } from '@nexus/schema';

import { CustomerType } from '../customer/graphql/Customer';
import PermissionService from './PermissionService';

export const PermissionType = objectType({
  name: 'PermssionType',

  definition(t) {
    t.id('id');
    t.string('name');
    t.string('description', { nullable: true });
    t.field('customer', { type: CustomerType, nullable: true });
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
      nullable: true,

      async resolve(parent, args, ctx) {
        if (!args.data?.name || !args.data?.customerId) {
          throw new Error('Name and/or customerID not valid!');
        }

        const permission = await ctx.services.permissionService.createPermission(
          args.data?.name,
          args.data?.customerId,
          args.data?.description,
        );

        return permission;
      },
    });
  },
});

export default [
  PermissionMutations,
  PermissionInput,
  PermissionType,
];
