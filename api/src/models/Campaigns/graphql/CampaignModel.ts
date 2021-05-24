import { enumType, extendType, inputObjectType, objectType } from '@nexus/schema';
import { ApolloError } from 'apollo-server';
import { CustomerType } from '../../customer/Customer';
import { DialogueType } from '../../questionnaire/Dialogue';

export const CampaignVariantEnum = enumType({
  name: 'CampaignVariantEnum',

  members: ['SMS', 'EMAIL', 'QUEUE'],
});

export const CampaignScheduleEnum = enumType({
  name: 'CampaignScheduleEnum',

  members: ['GENERAL', 'RECURRING', 'FOLLOW_UP']
});

export const CampaignVariantModel = objectType({
  name: 'CampaignVariantType',
  description: 'Variant of campaign',

  definition(t) {
    t.id('id');
    t.string('label');
    t.int('weight');
    t.string('body');
    t.int('depth');

    // Types
    t.field('type', { type: CampaignVariantEnum });
    t.field('scheduleType', { type: CampaignScheduleEnum });

    // Related 1:many relations
    t.field('workspace', { type: CustomerType });
    t.field('dialogue', { type: DialogueType });
  }
})

export const CampaignModel = objectType({
  name: 'CampaignType',
  description: 'Campaign',

  definition(t) {
    t.id('id');
    t.string('label');
    t.list.field('variants', { type: CampaignVariantModel });
  },
});
