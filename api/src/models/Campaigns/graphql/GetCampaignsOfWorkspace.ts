import { extendType } from "@nexus/schema";

import { CampaignModel } from "./CampaignModel";

/**
 * Access pattern for accessign all campaigns belonging to a workspace.
 */
export const GetCampaignsOfWorkspace = extendType({
  type: 'Customer',

  definition(t) {
    t.list.field('campaigns', {
      type: CampaignModel,
      // @ts-ignore
      resolve: async (parent, args, ctx) => {
        const workspaceWithCampaigns = await ctx.prisma.customer.findFirst({
          where: { id: parent.id },
          include: {
            campaigns: {
              include: {
                variantsEdges: {
                  include: {
                    campaignVariant: true,
                  },
                },
              },
            },
          },
        });

        return workspaceWithCampaigns.campaigns.map(campaign => ({
          ...campaign,
          variants: campaign.variantsEdges.map((variantEdge) => ({
            weight: variantEdge.weight,
            ...variantEdge.campaignVariant
          }))
        })) || [] as any;
      },
    });
  },
});
