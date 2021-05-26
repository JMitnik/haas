import { UserInputError } from 'apollo-server';
import { mutationField } from '@nexus/schema';
import { isPresent } from 'ts-is-present';

import { CampaignModel } from './CampaignModel';
import { NexusGenInputs } from '../../../generated/nexus';
import { saveCampaignInputFactory } from './SaveCampaignInputFactory';

export const {
  CampaignInput: CreateCampaignInput,
  CampaignVariantEdgeInputType: CreateCampaignVariantEdgeInputType,
  CampaignVariantInputType: CreateCampaignVariantInputType
} = saveCampaignInputFactory('Create');

const validateProbabilityEdges = (input: NexusGenInputs['CreateCampaignInputType']) => {
  const weights = input.variants?.map((variant) => variant?.weight).filter(isPresent) || [];

  const totalWeight = weights?.reduce((total, weight) => total + weight);

  // Since approximation, let's do it like this
  if (totalWeight !== 100) {
    throw new UserInputError('Weights do not sum up to 100%');
  }
};

export const CreateCampaignResolver = mutationField('createCampaign', {
  type: CampaignModel,
  args: { input: CreateCampaignInput },

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
