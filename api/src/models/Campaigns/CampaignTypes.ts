import { Prisma } from '@prisma/client';

const campaignWithVariantsAndDeliveries = Prisma.validator<Prisma.CampaignArgs>()({
  include: {
    deliveries: true,
    variantsEdges: {
      include: {
        campaignVariant: {
          include: {
            dialogue: true,
            workspace: true,
            customVariables: true,
          }
        },
      }
    }
  }
});

export type CampaignWithVariants = Prisma.CampaignGetPayload<typeof campaignWithVariantsAndDeliveries>
