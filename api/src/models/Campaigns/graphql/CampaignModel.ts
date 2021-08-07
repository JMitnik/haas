import { enumType, extendType, inputObjectType, objectType } from '@nexus/schema';
import { ApolloError } from 'apollo-server';
import { CustomerType } from '../../customer/Customer';
import { DialogueType } from '../../questionnaire/Dialogue';

export const CampaignVariantEnum = enumType({
  name: 'CampaignVariantEnum',

  members: ['SMS', 'EMAIL', 'QUEUE'],
});

export const CampaignVariantModel = objectType({
  name: 'CampaignVariantType',
  description: 'Variant of campaign',

  definition(t) {
    t.id('id');
    t.string('label');
    t.int('weight');
    t.string('body');
    t.field('type', { type: CampaignVariantEnum });
    t.field('workspace', { type: CustomerType });
    t.field('dialogue', { type: DialogueType });
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
      nullable: true,
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
        } as any;
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

        if (!workspaceWithCampaigns) throw "Can't find workspace!"

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

export const GetCampaignVariantOfDelivery = extendType({
  type: 'DeliveryType',

  definition(t) {
    t.field('campaignVariant', {
      type: CampaignVariantModel,
      nullable: true,
      resolve: async (parent, args, ctx) => {
        if (!parent.id) throw new ApolloError('Cant find matching delivery');

        const campaignVariant = (await ctx.prisma.delivery.findUnique({
          where: { id: parent.id },
          include: {
            campaignVariant: {
              include: {
                CampaignVariantToCampaign: true,
                dialogue: true,
                workspace: true,
              }
            }
          }
        }))?.campaignVariant;

        if (!campaignVariant) throw new ApolloError('Parent delivery is not connected to campaign variant');

        return {
          id: campaignVariant.id,
          body: campaignVariant.body,
          dialogue: campaignVariant.dialogue,
          label: campaignVariant.label,
          weight: campaignVariant.CampaignVariantToCampaign[0].weight,
          workspace: campaignVariant.workspace,
          type: campaignVariant.type
        };
      }
    })
  }
})
