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
    await cleanCampaignDatabase(prisma);
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

  test('fetches campaign with 3 nested variants', async () => {
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
              condition: 'ON_NOT_FINISHED',
              childVariant: {
                id: 'DEEPLY_NESTED_CHILD_VARIANT',
                dialogueId,
                workspaceId,
                scheduleType: 'FOLLOW_UP',
                type: 'EMAIL',
              }
            }, {
              condition: 'ON_NOT_OPENED',
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

    // Variants
    expect(campaign?.variants).toHaveLength(4);
    expect(campaign?.nestedVariantEdges).toHaveLength(3);

    //Relation: PARENT_VARIANT => CHILD_VARIANT
    expect(campaign?.nestedVariantEdges[0].parentCampaignVariantId).toBe('PARENT_VARIANT');
    expect(campaign?.nestedVariantEdges[0].childCampaignVariantId).toBe('CHILD_VARIANT');
    expect(campaign?.nestedVariantEdges[0].condition).toBe(null);

    // Relation: CHILD_VARIANT => DEEPLY_NESTED_CHILD_VARIANT
    expect(campaign?.nestedVariantEdges[1].parentCampaignVariantId).toBe('CHILD_VARIANT');
    expect(campaign?.nestedVariantEdges[1].childCampaignVariantId).toBe('DEEPLY_NESTED_CHILD_VARIANT');
    expect(campaign?.nestedVariantEdges[1].condition).toBe('ON_NOT_FINISHED');

    // Relation: CHILD_VARIANT => DEEPLY_NESTED_CHILD_VARIANT_SIBLING
    expect(campaign?.nestedVariantEdges[2].parentCampaignVariantId).toBe('CHILD_VARIANT');
    expect(campaign?.nestedVariantEdges[2].childCampaignVariantId).toBe('DEEPLY_NESTED_CHILD_VARIANT_SIBLING');
    expect(campaign?.nestedVariantEdges[2].condition).toBe('ON_NOT_OPENED');

  });

  test('can extract all variant edges from editCampaignInput', async () => {
    const editCampaignInput: any = {
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
          parentVariantId: '',
          childVariant: {
            id: 'CHILD_VARIANT_NEW',
            dialogueId,
            workspaceId,
            scheduleType: 'FOLLOW_UP',
            type: 'SMS',
            label: 'New SMS follow up one!',
            children: [{
              parentVariantId: 'CHILD_VARIANT_NEW_NESTED',
              childVariant: {
                id: '',
                dialogueId,
                workspaceId,
                scheduleType: 'FOLLOW_UP',
                type: 'SMS',
                label: 'New SMS follow up one!',
              }
            }]
          }
        },{
          parentVariantId: '',
          childVariant: {
            id: 'CHILD_VARIANT_NEW_2',
            dialogueId,
            workspaceId,
            scheduleType: 'FOLLOW_UP',
            type: 'SMS',
            label: 'New SMS follow up one!',
            children: [{
              parentVariantId: 'CHILD_VARIANT_NEW_NESTED_2',
              childVariant: {
                id: '',
                dialogueId,
                workspaceId,
                scheduleType: 'FOLLOW_UP',
                type: 'SMS',
                label: 'New SMS follow up one!',
              }
            }]
          }
        }]
      }]
    };
    const edges = CampaignPrismaAdapter.parseVariantEdgesFromEditCampaignInput(
      editCampaignInput
    );

    expect(edges).toHaveLength(4);
  });

  test('can extract all variants from editCampaignInput', async () => {
    const editCampaignInput: any = {
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
          parentVariantId: '',
          childVariant: {
            id: 'CHILD_VARIANT_NEW',
            dialogueId,
            workspaceId,
            scheduleType: 'FOLLOW_UP',
            type: 'SMS',
            label: 'New SMS follow up one!',
            children: [{
              parentVariantId: 'CHILD_VARIANT_NEW_NESTED',
              childVariant: {
                id: '',
                dialogueId,
                workspaceId,
                scheduleType: 'FOLLOW_UP',
                type: 'SMS',
                label: 'New SMS follow up one!',
              }
            }]
          }
        },{
          parentVariantId: '',
          childVariant: {
            id: 'CHILD_VARIANT_NEW_2',
            dialogueId,
            workspaceId,
            scheduleType: 'FOLLOW_UP',
            type: 'SMS',
            label: 'New SMS follow up one!',
            children: [{
              parentVariantId: 'CHILD_VARIANT_NEW_NESTED_2',
              childVariant: {
                id: '',
                dialogueId,
                workspaceId,
                scheduleType: 'FOLLOW_UP',
                type: 'SMS',
                label: 'New SMS follow up one!',
              }
            }]
          }
        }]
      }]
    };
    const variants = CampaignPrismaAdapter.parseVariantsFromEditCampaignInput(
      editCampaignInput
    );

    expect(variants).toHaveLength(5);
  });

  test.only('edits existing campaign in database', async () => {
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
        body: 'Test2',
        weight: 50,
        children: null,
      }, {
        id: 'SIBLING_VARIANT',
        dialogueId,
        workspaceId,
        scheduleType: 'GENERAL',
        type: 'EMAIL',
        body: 'BODY VARIANT 2',
        weight: 40,
        children: [{
          id: 'SON_EDGE',
          parentVariantId: 'SIBLING_VARIANT',
          childVariant: {
            id: 'SON_VARIANT',
            dialogueId,
            workspaceId,
            scheduleType: 'FOLLOW_UP',
            type: 'EMAIL'
          }
        }]
      }]
    });
    const refetchedCampaign = await campaignPrismaAdapter.getCampaignById(editedCampaign.id);
    console.log(refetchedCampaign);

    const editedCampaignAgain = await campaignPrismaAdapter.editCampaign({
      id: 'CAMPAIGN_1',
      workspaceId,
      label: 'Test',
      variants: [{
        id: 'PARENT_VARIANT',
        dialogueId,
        workspaceId,
        scheduleType: 'GENERAL',
        type: 'EMAIL',
        body: 'Test2',
        weight: 50,
        children: null,
      }]
    });

    const rerefetchedCampaign = await campaignPrismaAdapter.getCampaignById(editedCampaign.id);
    console.log(rerefetchedCampaign);
  });
})