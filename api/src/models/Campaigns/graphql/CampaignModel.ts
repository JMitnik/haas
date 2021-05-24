import { enumType, objectType } from '@nexus/schema';

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

export const CampaignVariantEdgeConditionEnumType = enumType({
  name: 'CampaignVariantEdgeConditionEnumType',

  members: ['ON_NOT_FINISHED', 'ON_NOT_OPENED']
});

export const CampaignVariantEdgeModel = objectType({
  name: 'CampaignVariantEdgeType',
  description: 'Connects a campaign variant to the next campaign variant',

  definition(t) {
    t.id('id');

    t.field('condition', {
      type: CampaignVariantEdgeConditionEnumType,
      nullable: true,
      // @ts-ignore
      resolve: async (parent, _, ctx) => {
        const condition = (await ctx.services.campaignService.getCampaignVariantEdge(
          parent.id
        )).condition;

        return condition;
      }
    })

    t.field('parentCampaignVariant', {
      type: CampaignVariantModel,
      // @ts-ignore
      resolve: async (parent, _, ctx) => {
        const parentCampaignVariant = (await ctx.services.campaignService.getCampaignVariantEdge(
          parent.id
        )).parentCampaignVariant;

        return parentCampaignVariant || null;
      }
    });

    t.field('childCampaignVariant', {
      type: CampaignVariantModel,
      nullable: true,
      // @ts-ignore
      resolve: async (parent, _, ctx) => {
        const childCampaignVariant = (await ctx.services.campaignService.getCampaignVariantEdge(
          parent.id
        )).childCampaignVariant;

        return childCampaignVariant || null;
      }
    });
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
    t.int('depth');

    // Types
    t.field('type', { type: CampaignVariantEnum });
    t.field('scheduleType', { type: CampaignScheduleEnum });

    // Related 1:many relations
    t.field('workspace', { type: CustomerType });
    t.field('dialogue', { type: DialogueType });

    // Pointer to parent
    t.field('parent', { type: CampaignVariantEdgeModel, nullable: true })

    // Pointer to children edges
    t.list.field('children', { type: CampaignVariantEdgeModel, nullable: true });
  }
});

export const CampaignModel = objectType({
  name: 'CampaignType',
  description: 'Campaign',

  definition(t) {
    t.id('id');
    t.string('label');
    t.list.field('variants', { type: CampaignVariantModel });
  },
});