import { Prisma, PrismaClient } from '@prisma/client';

export const prepData = async (
  prisma: PrismaClient,
  createWorkspaceInput: Prisma.CustomerCreateInput,
  createDialogueInput: Prisma.DialogueCreateInput,
  createCampaignInput: Prisma.CampaignCreateInput,
  createDeliveriesInputs: Prisma.DeliveryCreateInput[],
) => {
  if (process.env.NODE_ENV === 'test') {
    await prisma.$transaction([
      prisma.customer.create({ data: createWorkspaceInput }),
      prisma.dialogue.create({ data: createDialogueInput }),
      prisma.campaign.create({ data: createCampaignInput }),
    ]);

    await Promise.all(createDeliveriesInputs.map(async createDeliveryInput => (
      await prisma.delivery.create({ data: createDeliveryInput })
    )));
  }
}

export const clearDatabase = async (prisma: PrismaClient) => {
  if (process.env.NODE_ENV === 'test') {
    await prisma.$transaction([
      prisma.delivery.deleteMany({}),
      prisma.campaignVariantCustomVariable.deleteMany({}),
      prisma.campaignVariantToCampaign.deleteMany({}),
      prisma.campaignVariant.deleteMany({}),
      prisma.campaign.deleteMany({}),
      prisma.dialogue.deleteMany({}),
      prisma.customer.deleteMany({}),
    ]);
  }
}
