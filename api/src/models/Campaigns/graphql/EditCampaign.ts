import { UserInputError } from 'apollo-server';
import { mutationField } from '@nexus/schema';
import { isPresent } from 'ts-is-present';

import { CampaignModel } from './CampaignModel';
import { NexusGenInputs } from '../../../generated/nexus';
import { saveCampaignInputFactory } from './SaveCampaignFactory';

export const {
  CampaignInput: EditCampaignInput,
  CampaignVariantEdgeInputType: EditCampaignVariantEdgeInputType,
  CampaignVariantInputType: EditCampaignVariantInputType
} = saveCampaignInputFactory('Edit');

export const EditCampaignResolver = mutationField('editCampaign', {
  type: CampaignModel,
  args: { input: EditCampaignInput },

  async resolve(parent, args, ctx) {
    if (!args.input) throw new UserInputError('Empty input!');

    // const campaign = await ctx.services.campaignService.createCampaign(args.input);

    return {} as any;
  },
});
