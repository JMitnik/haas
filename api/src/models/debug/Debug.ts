import { mutationField, objectType } from '@nexus/schema';

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
    const test = CampaignService.getPaginatedDeliveries();
    console.log(test);
    return 'asasdasd';
  },
});
