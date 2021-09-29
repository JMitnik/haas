import { PrismaClient } from "@prisma/client";

export const clearDatabase = async (prisma: PrismaClient) => {
  const delSessions = prisma.session.deleteMany({});
  const delDeliveries = prisma.delivery.deleteMany({});
  const delCampaignVariants = prisma.campaignVariant.deleteMany({});
  const delCampaigns = prisma.campaign.deleteMany({});

  await prisma.$transaction([
    delCampaignVariants,
    delCampaigns,
    delDeliveries,
    delSessions,
  ]);
};