import { objectType } from '@nexus/schema';

export const DebugType = objectType({
  name: 'Debug',
  definition(t) {
    t.field('debugResolver', {
      type: 'String',
      nullable: true,

      async resolve(parent: any, args, ctx) {
        return {} as any;
      },
    });
  },
});

export default [
  DebugType,
];
