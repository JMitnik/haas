import { enumType, objectType } from '@nexus/schema';

export const CampaignModel = objectType({
  name: 'Campaign',
  description: 'Campaign',
  definition(t) {
    t.id('id');
  },
});

export const CampaignVariantEnum = enumType({
  name: 'CampaignVariantEnum',

  members: ['SMS', 'EMAIL', 'QUEUE'],
});
