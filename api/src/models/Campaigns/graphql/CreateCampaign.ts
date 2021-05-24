import { UserInputError } from 'apollo-server';
import { inputObjectType, mutationField } from '@nexus/schema';
import { isPresent } from 'ts-is-present';

import {
  CampaignModel,
  CampaignScheduleEnum,
  CampaignVariantEdgeConditionEnumType,
  CampaignVariantEnum
} from './CampaignModel';
import { NexusGenInputs } from '../../../generated/nexus';

export const CampaignVariantEdgeInputType = inputObjectType({
  name: 'CampaignVariantEdgeInputType',

  definition(t) {
    t.field('childVariant', { required: false, type: CampaignVariantInputType });
    t.field('condition', { type: CampaignVariantEdgeConditionEnumType });
  }
});

export const CampaignVariantInputType = inputObjectType({
  name: 'CampaignVariantInputType',

  definition(t) {
    t.string('label');

    t.id('workspaceId', { required: true });
    t.id('dialogueId', { required: true });

    t.int('depth');
    t.string('body');
    t.float('weight', { required: false });
    t.string('subject', { required: false });

    t.field('scheduleType', { type: CampaignScheduleEnum, required: true });
    t.field('type', { type: CampaignVariantEnum, required: true });

    t.list.field('children', { type: CampaignVariantEdgeInputType })
  }
});

export const CreateCampaignVariantInputType = inputObjectType({
  name: 'CreateCampaignVariantInputType',
  definition(t) {
    t.field('data', { type: CampaignVariantInputType, required: true });
  },
});

export const CreateCampaignInputType = inputObjectType({
  name: 'CreateCampaignInputType',
  definition(t) {
    t.string('label');
    t.id('workspaceId', { required: true });
    t.list.field('variants', { type: CreateCampaignVariantInputType });
  },
});

const validateProbabilityEdges = (input: NexusGenInputs['CreateCampaignInputType']) => {
  const weights = input.variants?.map((variant) => variant.data?.weight).filter(isPresent) || [];

  const totalWeight = weights?.reduce((total, weight) => total + weight);

  // Since approximation, let's do it like this
  if (totalWeight !== 100) {
    throw new UserInputError('Weights do not sum up to 100%');
  }
};

export const CreateCampaignResolver = mutationField('createCampaign', {
  type: CampaignModel,
  args: { input: CreateCampaignInputType },

  async resolve(parent, args, ctx) {
    if (!args.input) throw new UserInputError('Empty input!');
    validateProbabilityEdges(args?.input);

    const campaign = await ctx.services.campaignService.createCampaign(args.input);

    return {
      ...campaign,
      deliveries: [],
      variants: campaign.variantsEdges.map(variantEdge => ({
        weight: variantEdge.weight,
        ...variantEdge.campaignVariant,
      }))
    };
  },
});
