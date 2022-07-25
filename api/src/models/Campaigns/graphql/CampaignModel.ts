import { extendType, inputObjectType, objectType } from 'nexus';
import { UserInputError } from 'apollo-server';

import { CampaignVariantModel } from './CampaignVariantModel';
import { DeliveryConnectionModel } from './DeliveryConnectionModel';
import { DeliveryConnectionFilterInput } from './DeliveryConnectionFilterInput';
import { NexusGenFieldTypes } from '../../../generated/nexus';

export const CampaignModel = objectType({
  name: 'CampaignType',
  description: 'Campaign',

  definition(t) {
    t.id('id');
    t.string('label');
    t.list.field('variants', { type: CampaignVariantModel, nullable: true });

    t.field('deliveryConnection', {
      type: DeliveryConnectionModel,
      nullable: true,
      args: { filter: DeliveryConnectionFilterInput },

      resolve: async (parent, args, ctx) => {
        if (!parent.id) return null;

        const deliveryConnection = await ctx.services.campaignService.getDeliveryConnection(
          parent.id,
          args.filter
        );

        return deliveryConnection || null;
      },
    });
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
            })),
          ],
        };
      },
    })
  },
});

