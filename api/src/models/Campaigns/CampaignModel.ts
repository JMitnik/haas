import { enumType, extendType, inputObjectType, objectType } from '@nexus/schema';

export const CampaignVariantModel = objectType({
  name: 'CampaignVariantType',
  description: 'Variant of campaign',

  definition(t) {
    t.id('id');
    t.string('label');
    t.int('weight');
    t.string('body');
  }
})

export const CampaignModel = objectType({
  name: 'CampaignType',
  description: 'Campaign',

  definition(t) {
    t.id('id');
    t.string('label');
    t.list.field('variants', { type: CampaignVariantModel });
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
                campaignVariant: true,
              }
            }
          }
        });

        return {
          ...workspaceWithCampaign,
          deliveries: [],
          variants: [
            ...workspaceWithCampaign.variantsEdges.map(variantEdge => ({
              ...variantEdge.campaignVariant,
              weight: variantEdge.weight
            }))
          ]
        };
      }
    })
  }
})

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

export const CampaignVariantEnum = enumType({
  name: 'CampaignVariantEnum',

  members: ['SMS', 'EMAIL', 'QUEUE'],
});
