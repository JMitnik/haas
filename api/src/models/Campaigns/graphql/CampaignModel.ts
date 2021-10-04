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

/**
 * Access pattern for accessign all campaigns belonging to a workspace.
 */
export const GetCampaignsOfWorkspace = extendType({
  type: 'Customer',

  definition(t) {
    t.list.field('campaigns', {
      type: CampaignModel,
      resolve: async (parent, args, ctx) => {
        const workspaceWithCampaigns = await ctx.services.campaignService.findCampaignsOfWorkspace(parent.id);
        if (!workspaceWithCampaigns) throw new UserInputError('Can\'t find workspace!');

        return workspaceWithCampaigns.campaigns.map(campaign => ({
          ...campaign,
          variants: campaign.variantsEdges.map((variantEdge) => ({
            weight: variantEdge.weight,
            ...variantEdge.campaignVariant
          }))
        })) || [];
      },
    });
  },
});

export const GetCampaignVariantOfDelivery = extendType({
  type: 'DeliveryType',

  definition(t) {
    t.field('campaignVariant', {
      type: CampaignVariantModel,
      nullable: true,
      // @ts-ignore
      resolve: async (parent, args, ctx) => {
        if (!parent.id) throw new ApolloError('Cant find matching delivery');

        const campaignVariant = ctx.prisma.delivery.findUnique({
          where: { id: parent.id },
        }).campaignVariant();

        return campaignVariant;
      }
    })
  }
})
