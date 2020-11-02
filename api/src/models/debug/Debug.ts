import { mutationField, objectType } from '@nexus/schema';
import prisma from '../../config/prisma';

export const DebugType = objectType({
  name: 'Debug',
  definition(t) {
    t.field('debugResolver', {
      type: 'String',
      nullable: true,

      async resolve() {
        return {} as any;
      },
    });
  },
});

export const DebugMutation = mutationField('debugMutation', {
  type: 'String',
  nullable: true,
  async resolve() {
    // heapdump.writeSnapshot(`heapDump-${Date.now()}.heapsnapshot`, (err, filename) => {
    //   console.log('Heap dump of a bloated server written to', filename);

    //   return 'Saved heap dump';
    // });
    return 'test';
  },
});
