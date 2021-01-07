import { mutationField, objectType } from '@nexus/schema';
import prisma from '../../config/prisma';

import { CampaignService } from '../Campaigns/CampaignService';

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
    const deliveries = await prisma.delivery.findMany({
      orderBy: {
        scheduledAt: "desc",
      },
      take: 10,
      skip: 10
    })

    console.log(deliveries)
    return 'asasdasd';
  },
});
