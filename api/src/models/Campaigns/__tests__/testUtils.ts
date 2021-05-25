import { PrismaClient } from "@prisma/client";

export const seedWorkspace = async (prisma: PrismaClient, workspaceId: string, dialogueId: string) => {
  const createWorkspace = await prisma.customer.create({
    data: {
      id: workspaceId,
      name: 'Test',
      slug: 'slug',
      dialogues: {
        create: {
          id: dialogueId,
          description: 'Random description',
          slug: '',
          title: 'Dialogue'
        }
      }
    }
  });
};

export const cleanCampaignDatabase = async (prisma: PrismaClient) => {
  const deleteCampaignsCampainVariantEdge = prisma.campaignVariantEdge.deleteMany({});
  const deleteCampaignsVariants = prisma.campaignVariant.deleteMany({});
  const deleteCampaignVariantToCampaigns = prisma.campaignVariantToCampaign.deleteMany({});
  const deleteCampaigns = prisma.campaign.deleteMany({});
  const deleteDialogues = prisma.dialogue.deleteMany({});
  const deleteWorkspaces = prisma.customer.deleteMany({});
  await prisma.$transaction([
    deleteCampaignsCampainVariantEdge,
    deleteCampaignVariantToCampaigns,
    deleteCampaignsVariants,
    deleteCampaigns,
    deleteDialogues,
    deleteWorkspaces
  ]);
}