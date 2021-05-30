import { PrismaClient } from "@prisma/client";
import { NexusGenInputs } from "../../../generated/nexus";

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

export const workspaceId = 'WORKSPACE_123';
export const dialogueId = 'DIALOGUE_123';

export const defaultWorkspaceInput: NexusGenInputs['CreateCampaignInputType'] = {
  id: 'CAMPAIGN_1',
  workspaceId,
  label: 'Test',
  variants: [{
    id: 'PARENT_VARIANT',
    dialogueId,
    workspaceId,
    scheduleType: 'GENERAL',
    type: 'EMAIL',
    body: 'Test',
    children: [{
      childVariant: {
        id: 'CHILD_VARIANT',
        dialogueId,
        workspaceId,
        scheduleType: 'FOLLOW_UP',
        type: 'EMAIL'
      }
    }]
  }]
};