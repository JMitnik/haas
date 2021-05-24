import { makeTestPrisma } from "../../../test/utils/makeTestPrisma";
import { CampaignService } from "../CampaignService";

const prisma = makeTestPrisma();

const workspaceId = 'WORKSPACE_123';
const dialogueId = 'DIALOGUE_123';

describe('CampaignService tests', () => {
  beforeEach(async () => {
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
  });

  afterEach(async () => {
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
    prisma.$disconnect();
  });

  test('Creates Nested Variants', async () => {
    const campaignService = new CampaignService(prisma);

    await campaignService.createCampaign({
      workspaceId,
      label: 'Test',
      variants: [{
        data: {
          dialogueId,
          workspaceId,
          scheduleType: 'GENERAL',
          type: 'EMAIL',
          body: 'Test',
          children: [{
            childVariant: {
              dialogueId,
              workspaceId,
              scheduleType: 'FOLLOW_UP',
              type: 'EMAIL'
            }
          }]
        }
      }]
    });

    const allCampaigns = await prisma.campaignVariant.findMany({});
    expect(allCampaigns.length).toBe(2);
  });
});