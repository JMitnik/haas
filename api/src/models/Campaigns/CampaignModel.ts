import { enumType, extendType, inputObjectType, objectType } from '@nexus/schema';

export const CampaignModel = objectType({
  name: 'Campaign',
  description: 'Campaign',
  definition(t) {
    t.id('id');
  },
});

export const GetCampaignsInput = inputObjectType({
  name: 'GetCampaignsInput',
  definition(t) {
    t.string('customerSlug');
  },
});

export const GetCampaignsOfWorkspace = extendType({
  type: 'Customer',

  definition(t) {
    t.list.field('campaigns', {
      type: CampaignModel,
      resolve: async (parent, args, ctx) => {
        console.log(parent);
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

        return workspaceWithCampaigns.campaigns || [];
      },
    });
  },
});

export const CampaignVariantEnum = enumType({
  name: 'CampaignVariantEnum',

  members: ['SMS', 'EMAIL', 'QUEUE'],
});
