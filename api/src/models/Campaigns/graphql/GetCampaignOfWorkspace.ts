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
              variantsEdges: {
                include: {
                  campaignVariant: {
                    include: {
                      dialogue: true,
                      workspace: true,
                    }
                  },
                }
              }
            }
          });

          return {
            ...workspaceWithCampaign,
            variantEdges: workspaceWithCampaign.variantsEdges.map(variantEdge => ({
              scheduleType: 'GENERAL',
              conditionType: 'AB_SAMPLING',
              condition: { AB__weight: variantEdge.weight },
              childCampaignVariant: variantEdge.campaignVariant,
            }))
          };
        }
      })
    }
  })
