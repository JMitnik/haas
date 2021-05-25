import { makeTestPrisma } from "../../../test/utils/makeTestPrisma";
import { CampaignPrismaAdapter } from "../CampaignPrismaAdapter";
import { CampaignService } from "../CampaignService";
import { cleanCampaignDatabase, seedWorkspace } from "./testUtils";

const prisma = makeTestPrisma();
const campaignPrismaAdapter = new CampaignPrismaAdapter(prisma);

const workspaceId = 'WORKSPACE_123';
const dialogueId = 'DIALOGUE_123';

describe('CampaignService tests', () => {
  beforeEach(async () => {
    await seedWorkspace(prisma, workspaceId, dialogueId);
  });

  afterEach(async () => {
    await cleanCampaignDatabase(prisma);
    prisma.$disconnect();
  });

  test('Creates Nested Variants', async () => {
    const campaignService = new CampaignService(prisma, campaignPrismaAdapter);

    await campaignService.createCampaign({
      workspaceId,
      label: 'Test',
      variants: [{
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
      }]
    });

    const allCampaigns = await prisma.campaignVariant.findMany({});
    expect(allCampaigns.length).toBe(2);
  });
});