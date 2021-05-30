import { intersection } from "lodash";
import { NexusGenInputs } from "../../../generated/nexus";
import { makeTestPrisma } from "../../../test/utils/makeTestPrisma";
import { CampaignPrismaAdapter } from "../CampaignPrismaAdapter";
import { cleanCampaignDatabase, defaultWorkspaceInput, seedWorkspace } from "./testUtils";

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
    const campaign = await campaignPrismaAdapter.createCampaign(defaultWorkspaceInput);

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
    const editCampaignInput: NexusGenInputs['EditCampaignVariantInputType'][] = [{
        id: 'PARENT_VARIANT',
        dialogueId,
        workspaceId,
        scheduleType: 'GENERAL',
        type: 'EMAIL',
        body: 'Test',
        children: [{
          id: '',
          parentVariantId: '',
          childVariant: {
            id: 'CHILD_VARIANT_NEW',
            dialogueId,
            workspaceId,
            scheduleType: 'FOLLOW_UP',
            type: 'SMS',
            label: 'New SMS follow up one!',
            children: [{
              id: '',
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
        }, {
          id: '',
          parentVariantId: '',
          childVariant: {
            id: 'CHILD_VARIANT_NEW_2',
            dialogueId,
            workspaceId,
            scheduleType: 'FOLLOW_UP',
            type: 'SMS',
            label: 'New SMS follow up one!',
            children: [{
              id: '',
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
      }];
    const edges = CampaignPrismaAdapter.parseVariantEdgesFromEditCampaignInputs(
      editCampaignInput
    );

    expect(edges).toHaveLength(4);
  });

  test('can disconnect an unknown campaign variant root campaign edge', async () => {
    const createdCampaign = await campaignPrismaAdapter.createCampaign({
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
          id: 'FIRST_PARENT_TO_CHILD',
          childVariant: {
            id: 'CHILD_VARIANT',
            dialogueId,
            workspaceId,
            scheduleType: 'FOLLOW_UP',
            type: 'EMAIL'
          }
        }]
      }, {
        id: 'PARENT_VARIANT_FIRST_SIBLING',
        dialogueId,
        workspaceId,
        scheduleType: 'GENERAL',
        type: 'EMAIL',
        body: 'Test',
        children: [{
          id: 'SECOND_PARENT_TO_CHILD',
          childVariant: {
            id: 'CHILD_VARIANT_COUSIN',
            dialogueId,
            workspaceId,
            scheduleType: 'FOLLOW_UP',
            type: 'EMAIL'
          }
        }]
      }]
    });

    await campaignPrismaAdapter.editCampaignVariants(createdCampaign?.id || '', [
      {
        id: 'PARENT_VARIANT',
        dialogueId,
        workspaceId,
        scheduleType: 'GENERAL',
        type: 'EMAIL',
        body: 'Test',
        children: [{
          id: '',
          parentVariantId: 'PARENT_VARIANT',
          childVariant: {
            id: 'CHILD_VARIANT_NEW',
            dialogueId,
            workspaceId,
            scheduleType: 'FOLLOW_UP',
            type: 'SMS',
            label: 'New SMS follow up one!',
            children: [{
              id: '',
              parentVariantId: 'CHILD_VARIANT_NEW',
              childVariant: {
                id: 'GRAND__PARENT_VARIANT',
                dialogueId,
                workspaceId,
                scheduleType: 'FOLLOW_UP',
                type: 'SMS',
                label: 'New SMS follow up one!',
              }
            }]
          }
        },
        ]
      }
    ]);

    const removedVariantIds = ['CHILD_VARIANT', 'PARENT_VARIANT_FIRST_SIBLING', 'CHILD_VARIANT_COUSIN'];
    const removedVariantEdges = ['FIRST_PARENT_TO_CHILD', 'SECOND_PARENT_TO_CHILD'];
    const newCampaign = await campaignPrismaAdapter.getCampaignById(createdCampaign?.id || '');

    // Ensure the direct variants are removed from the campaign
    expect(newCampaign?.variantsEdges).toHaveLength(1);
    expect(newCampaign?.variantsEdges.filter(variant => variant.campaignVariantId === 'PARENT_VARIANT_FIRST_SIBLING')).toHaveLength(0);

    // Ensure the removed variants are actually not in the campaign any longer
    expect(intersection(
      newCampaign?.variants.map(variant => variant.id),
      removedVariantIds
    )).toHaveLength(0);

    // Ensure the removed variants are not deleted, however.
    removedVariantIds.forEach(async (removedVariantId) => {
      expect(await campaignPrismaAdapter.getCampaignVariantById(removedVariantId)).not.toBeUndefined();
    });

    // Ensure the related deleted edges have been removed
    expect(intersection(
      newCampaign?.nestedVariantEdges.map(edge => edge.id),
      removedVariantEdges
    )).toHaveLength(0);

    // Ensure that the variant has no more of the older edge children.
    const remainingVariant = newCampaign?.variants.find(variant => variant.id === 'PARENT_VARIANT');
    expect(intersection(
      remainingVariant?.children.map(child => child.id),
      removedVariantEdges
    )).toHaveLength(0);
  });

  test('can preserve campaign variant structure on edit', async () => {
    const createdCampaign = await campaignPrismaAdapter.createCampaign({
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
          id: 'FIRST_PARENT_TO_CHILD',
          childVariant: {
            id: 'CHILD_VARIANT',
            dialogueId,
            workspaceId,
            scheduleType: 'FOLLOW_UP',
            type: 'EMAIL',
            children: [
              {
                id: 'NESTED_PARENT_TO_CHILD_1',
                childVariant: {
                  id: 'GRAND_CHILD_VARIANT_1',
                  dialogueId,
                  workspaceId,
                  scheduleType: 'FOLLOW_UP',
                  type: 'EMAIL',
                }
              },
              {
                id: 'NESTED_PARENT_TO_CHILD_2',
                childVariant: {
                  id: 'GRAND_CHILD_VARIANT_2',
                  dialogueId,
                  workspaceId,
                  scheduleType: 'FOLLOW_UP',
                  type: 'EMAIL',
                }
              }
            ]
          }
        }]
      }, {
        id: 'PARENT_VARIANT_FIRST_SIBLING',
        dialogueId,
        workspaceId,
        scheduleType: 'GENERAL',
        type: 'EMAIL',
        body: 'Test',
        children: [{
          id: 'SECOND_PARENT_TO_CHILD',
          childVariant: {
            id: 'CHILD_VARIANT_COUSIN',
            dialogueId,
            workspaceId,
            scheduleType: 'FOLLOW_UP',
            type: 'EMAIL'
          }
        }]
      }]
    });

    await campaignPrismaAdapter.editCampaignVariants(createdCampaign?.id || '', [{
      id: 'PARENT_VARIANT',
      dialogueId,
      workspaceId,
      scheduleType: 'GENERAL',
      type: 'EMAIL',
      body: 'Test',
      children: [{
        id: 'FIRST_PARENT_TO_CHILD',
        parentVariantId: 'PARENT_VARIANT',
        childVariant: {
          id: 'CHILD_VARIANT',
          dialogueId,
          workspaceId,
          scheduleType: 'FOLLOW_UP',
          type: 'EMAIL',
          children: [
            {
              id: 'NESTED_PARENT_TO_CHILD_1',
              parentVariantId: 'CHILD_VARIANT',
              childVariant: {
                id: 'GRAND_CHILD_VARIANT_1',
                dialogueId,
                workspaceId,
                scheduleType: 'FOLLOW_UP',
                type: 'EMAIL',
              }
            },
          ]
        }
      }]
    }]);

    const newCampaign = await campaignPrismaAdapter.getCampaignById(createdCampaign?.id || '');

    // Ensure on the campaign-level, the right structure is intact
    expect(newCampaign?.variantsEdges).toHaveLength(1);
    expect(newCampaign?.variants).toHaveLength(3);
    expect(newCampaign?.nestedVariantEdges).toHaveLength(2);

    // Ensure on the variant-level, the structure is intact
    const parentVariant = newCampaign?.variants.find(variant => variant.id === 'PARENT_VARIANT');
    expect(parentVariant?.children).toHaveLength(1);
    expect(parentVariant?.children[0].parentCampaignVariantId).toEqual('PARENT_VARIANT');
    expect(parentVariant?.children[0].childCampaignVariantId).toEqual('CHILD_VARIANT');

    const childVariant = newCampaign?.variants.find(variant => variant.id === 'CHILD_VARIANT');
    expect(childVariant?.children).toHaveLength(1);
    expect(childVariant?.children[0].id).toEqual('NESTED_PARENT_TO_CHILD_1');
    expect(childVariant?.children[0].parentCampaignVariantId).toEqual('CHILD_VARIANT');
    expect(childVariant?.children[0].childCampaignVariantId).toEqual('GRAND_CHILD_VARIANT_1');
  });

  test('can add new variants on edit', async () => {
    const createdCampaign = await campaignPrismaAdapter.createCampaign({
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
          id: 'FIRST_PARENT_TO_CHILD',
          childVariant: {
            id: 'CHILD_VARIANT',
            dialogueId,
            workspaceId,
            scheduleType: 'FOLLOW_UP',
            type: 'EMAIL'
          }
        }]
      }, {
        id: 'PARENT_VARIANT_FIRST_SIBLING',
        dialogueId,
        workspaceId,
        scheduleType: 'GENERAL',
        type: 'EMAIL',
        body: 'Test',
        children: [{
          id: 'SECOND_PARENT_TO_CHILD',
          childVariant: {
            id: 'CHILD_VARIANT_COUSIN',
            dialogueId,
            workspaceId,
            scheduleType: 'FOLLOW_UP',
            type: 'EMAIL'
          }
        }]
      }]
    });

    await campaignPrismaAdapter.editCampaignVariants(createdCampaign?.id || '', [
      {
      id: 'PARENT_VARIANT',
      dialogueId,
      workspaceId,
      scheduleType: 'GENERAL',
      type: 'EMAIL',
      body: 'Test',
      children: [{
        id: 'FIRST_PARENT_TO_CHILD',
        parentVariantId: 'PARENT_VARIANT',
        childVariant: {
          id: 'CHILD_VARIANT',
          dialogueId,
          workspaceId,
          scheduleType: 'FOLLOW_UP',
          type: 'EMAIL',
          children: [
            {
              id: 'NESTED_PARENT_TO_CHILD_1',
              parentVariantId: 'CHILD_VARIANT',
              condition: 'ON_NOT_FINISHED',
              childVariant: {
                id: 'GRAND_CHILD_VARIANT_1',
                dialogueId,
                workspaceId,
                scheduleType: 'FOLLOW_UP',
                type: 'EMAIL',
              }
            },
          ]
        }
      }]
    },
    {
      id: 'UNCLE_VARIANT',
      dialogueId,
      workspaceId,
      scheduleType: 'GENERAL',
      type: 'EMAIL',
      body: 'Test',
    }
    ]);

    const newCampaign = await campaignPrismaAdapter.getCampaignById(createdCampaign?.id || '');
    expect(newCampaign?.variants).toHaveLength(4);
    expect(newCampaign?.variantsEdges).toHaveLength(2);

    const newChildParent = newCampaign?.variants.find(variant => variant.id === 'CHILD_VARIANT');
    expect(newChildParent?.children).toHaveLength(1);
    expect(newChildParent?.children[0].condition).toEqual('ON_NOT_FINISHED');
    expect(newChildParent?.children[0].childCampaignVariantId).toEqual('GRAND_CHILD_VARIANT_1');

    const grandChild = newCampaign?.variants.find(variant => variant.id === 'GRAND_CHILD_VARIANT_1');
    expect(grandChild?.children).toHaveLength(0);
    expect(grandChild?.parent?.id).toEqual('NESTED_PARENT_TO_CHILD_1');

    expect(newCampaign?.variantsEdges).toHaveLength(2);
  });

  test('can extract all variants from editCampaignInput', async () => {
    const editCampaignInput: any = [{
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
      }, {
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
    }];
    const variants = CampaignPrismaAdapter.parseVariantsFromEditCampaignVariantInputs(
      editCampaignInput
    );

    expect(variants).toHaveLength(5);
  });
})