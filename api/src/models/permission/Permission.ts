import { extendType, inputObjectType, objectType } from '@nexus/schema';
import PermissionService from './PermissionService';

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
      resolve(parent: any, args: any) {
        const { name, description, customerId } = args.data;

        return PermissionService.createPermission(name, customerId, description);
      },
    });
  },
});

export default [
  PermissionMutations,
  PermissionInput,
  PermissionType,
];
