import { enumType, objectType } from '@nexus/schema';

import { CampaignModel } from './CampaignModel';
import { CustomerType } from '../../customer/Customer';
import { DialogueType } from '../../questionnaire/Dialogue';

export const CampaignVariantEnum = enumType({
  name: 'CampaignVariantEnum',

  members: ['SMS', 'EMAIL', 'QUEUE'],
});

export const CampaignVariantCustomVariableType = objectType({
  name: 'CampaignVariantCustomVariableType',

  definition(t) {
    t.id('id');
    t.string('key');
  }
});

export const CampaignVariantModel = objectType({
  name: 'CampaignVariantType',
  description: 'Variant of campaign',

  definition(t) {
    t.id('id');
    t.string('label');
    t.int('weight');
    t.string('body');
    t.string('from', { nullable: true });
    t.field('type', { type: CampaignVariantEnum });
    t.field('workspace', { type: CustomerType, nullable: true });
    t.field('dialogue', { type: DialogueType, nullable: true });
    t.field('campaign', { type: CampaignModel, nullable: true });

    t.list.field('customVariables', { type: CampaignVariantCustomVariableType, nullable: true });
  }
});
