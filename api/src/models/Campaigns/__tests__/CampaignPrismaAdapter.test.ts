import { makeTestPrisma } from "../../../test/utils/makeTestPrisma";
import { CampaignPrismaAdapter } from "../CampaignPrismaAdapter";
import { cleanCampaignDatabase, seedWorkspace } from "./testUtils";

const prisma = makeTestPrisma();
const campaignPrismaAdapter = new CampaignPrismaAdapter(prisma);

const workspaceId = 'WORKSPACE_123';
const dialogueId = 'DIALOGUE_123';

describe('CampaignPrismaAdapter', () => {
  beforeEach(async () => {
    await seedWorkspace(prisma, workspaceId, dialogueId);
  });

  afterEach(async () => {
    // await cleanCampaignDatabase(prisma);
    prisma.$disconnect();
  });

  test('creates campaign in database', async () => {
    const campaign = await campaignPrismaAdapter.createCampaign({
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
    });

    const allCampaigns = await prisma.campaignVariant.findMany({});
    expect(allCampaigns.length).toBe(2);
  });

  test.only('fetches campaign with 3 nested variants', async () => {
    // First create a very nested campaign
    await campaignPrismaAdapter.createCampaign({
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
            type: 'EMAIL',
            children: [{
              childVariant: {
                id: 'DEEPLY_NESTED_CHILD_VARIANT',
                dialogueId,
                workspaceId,
                scheduleType: 'FOLLOW_UP',
                type: 'EMAIL',
              }
            }, {
              childVariant: {
                id: 'DEEPLY_NESTED_CHILD_VARIANT_SIBLING',
                dialogueId,
                workspaceId,
                scheduleType: 'FOLLOW_UP',
                type: 'EMAIL',
              }
            }]
          }
        }]
      }]
    });

    const campaign = await campaignPrismaAdapter.getCampaignById('CAMPAIGN_1');
    console.log(JSON.stringify(campaign));
  });

  test('edits existing campaign in database', async () => {
    // First create a campaign
    const campaign = await campaignPrismaAdapter.createCampaign({
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
    });

    // First write a campaign to the database.
    const editedCampaign = await campaignPrismaAdapter.editCampaign({
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
        children: []
      }]
    });

    const parentVariant = await campaignPrismaAdapter.getCampaignVariantById('PARENT_VARIANT');
    expect(parentVariant?.children).toHaveLength(0);

    const allCampaigns = await prisma.campaignVariant.findMany({});
    expect(allCampaigns.length).toBe(2);
  });
})