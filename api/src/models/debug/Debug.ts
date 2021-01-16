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
    const node = await prisma.nodeEntry.groupBy({
      where: { relatedNode: { questionDialogueId: 'ckgmgqbmw7505178god5xgdmam2' } },
      count: { relatedNodeId: true },
      by: ['relatedNodeId'],
    });

    return 'haha';
  },
});
