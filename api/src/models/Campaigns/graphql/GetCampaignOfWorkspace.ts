import { extendType } from "@nexus/schema";

import { CampaignModel, CampaignVariantEdgeConditionEnumType } from "./CampaignModel";

/**
 * Access pattern for fetching a single campaign.
 */
export const GetCampaignOfWorkspace = extendType({
  type: 'Customer',

  definition(t) {
    t.field('campaign', {
      type: CampaignModel,
      args: { campaignId: 'String' },
      resolve: async (parent, args, ctx) => {
        const workspaceWithCampaign = await ctx.prisma.campaign.findFirst({
          where: {
            AND: [
              { workspaceId: parent.id },
              { id: args.campaignId || '' },
            ]
          },
          include: {
            deliveries: true,
            directVariantEdges: { include: { conditionValue: true } },
            variants: { include: { children: true } },
            nestedVariantEdges: { include: { conditionValue: true } },
          }
        });

        return {
          ...workspaceWithCampaign,
          flatVariantEdges: workspaceWithCampaign.nestedVariantEdges,
          flatVariants: workspaceWithCampaign.variants,
          variantEdges: workspaceWithCampaign.directVariantEdges
        } as any;
      }
    })
  }
})
