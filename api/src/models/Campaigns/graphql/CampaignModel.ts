import { extendType, inputObjectType, objectType } from '@nexus/schema';
import { ApolloError, UserInputError } from 'apollo-server';
import { CampaignVariantModel } from './CampaignVariantModel';


export const CampaignModel = objectType({
  name: 'CampaignType',
  description: 'Campaign',

  definition(t) {
    t.id('id');
    t.string('label');
    t.list.field('variants', { type: CampaignVariantModel, nullable: true });
  },
});

export const GetCampaignsInput = inputObjectType({
  name: 'GetCampaignsInput',
  definition(t) {
    t.string('customerSlug');
  },
});

/**
 * Access pattern for fetching a single campaign.
 */
export const GetCampaignOfWorkspace = extendType({
  type: 'Customer',

  definition(t) {
    t.field('campaign', {
      type: CampaignModel,
      args: { campaignId: 'String' },
      nullable: true,
      resolve: async (parent, args, ctx) => {
        if (!args.campaignId) throw new UserInputError('Missing campaign id');

        const workspaceWithCampaign = await ctx.services.campaignService.findCampaign(args.campaignId);

        if (!workspaceWithCampaign) return null;

        return {
          ...workspaceWithCampaign,
          deliveries: [],
          variants: [
            ...workspaceWithCampaign.variantsEdges.map(variantEdge => ({
              ...variantEdge.campaignVariant,
              weight: variantEdge.weight,
              dialogue: variantEdge.campaignVariant.dialogue,
              workspace: variantEdge.campaignVariant.workspace,
            }))
          ]
        };
      }
    })
  }
});

