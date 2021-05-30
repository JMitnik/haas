import { UserInputError } from 'apollo-server';
import { mutationField } from '@nexus/schema';
import { saveCampaignInputFactory } from './SaveCampaignInputFactory';

export const {
  CampaignInputType: EditCampaignInput,
  CampaignVariantEdgeInputType: EditCampaignVariantEdgeInputType,
  CampaignVariantInputType: EditCampaignVariantInputType,
  CampaignOutputProblemType: EditCampaignOutputProblemType,
  CampaignOutputSuccessType: EditCampaignOutputSuccessType,
  CampaignOutputType: EditCampaignOutputType
} = saveCampaignInputFactory('Edit');

export const EditCampaignResolver = mutationField('editCampaign', {
  type: EditCampaignOutputType,
  args: { input: EditCampaignInput },

  async resolve(parent, args, ctx) {
    if (!args.input) throw new UserInputError('Empty input!');

    try {
      const campaign = await ctx.services.campaignService.editCampaign(args.input) as any;
      return { campaign: campaign } as any;
  } catch(error) {
      return {
        problemMessage: `Something went wrong with ${error}`
      }
    }
  },
});
