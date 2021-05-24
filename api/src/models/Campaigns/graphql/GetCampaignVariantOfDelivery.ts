import { extendType } from "@nexus/schema";
import { ApolloError } from "apollo-server";

import { CampaignVariantModel } from "./CampaignModel";

export const GetCampaignVariantOfDelivery = extendType({
  type: 'DeliveryType',

  definition(t) {
    t.field('campaignVariant', {
      type: CampaignVariantModel,
      nullable: true,
      resolve: async (parent, args, ctx) => {
        if (!parent.id) throw new ApolloError('Cant find matching delivery');

        const campaignVariant = (await ctx.prisma.delivery.findOne({
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
});