import { extendType, inputObjectType, objectType } from '@nexus/schema';

import { CustomerType } from '../customer/graphql/Customer';

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

export default [
  PermissionInput,
  PermissionType,
];
