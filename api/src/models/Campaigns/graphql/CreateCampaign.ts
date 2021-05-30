import { UserInputError } from 'apollo-server';
import { mutationField } from '@nexus/schema';
import { isPresent } from 'ts-is-present';

import { CampaignModel } from './CampaignModel';
import { NexusGenInputs } from '../../../generated/nexus';
import { saveCampaignInputFactory } from './SaveCampaignInputFactory';

export const {
  CampaignInputType: CreateCampaignInput,
  CampaignVariantEdgeInputType: CreateCampaignVariantEdgeInputType,
  CampaignVariantInputType: CreateCampaignVariantInputType,
  CampaignOutputProblemType: CreateCampaignOutputProblemType,
  CampaignOutputSuccessType: CreateCampaignOutputSuccessType,
  CampaignOutputType: CreateCampaignOutputType
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
  type: CreateCampaignOutputType,
  args: { input: CreateCampaignInput },

  async resolve(parent, args, ctx) {
    if (!args.input) throw new UserInputError('Empty input!');
    let problems = await ctx.services.campaignValidator.validateCreateCampaignInput(
      args.input
    );

    if (problems.length) {
      return {
        problemMessage: 'Input problems encountered!',
        fields: problems
      }
    }

    try {
      validateProbabilityEdges(args?.input);
    } catch (error) {
      return {
        problemMessage: 'Weights are not correct!'
      }
    }

    const campaign = await ctx.services.campaignService.createCampaign(args.input);

    if (!campaign) {
      return {
        problemMessage: 'A difficulty was held with campaign, try again!'
      }
    }

    return {
      campaign
    } as any;
  },
});
