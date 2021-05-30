import { makeTestPrisma } from "../../../test/utils/makeTestPrisma";
import { CampaignPrismaAdapter } from "../CampaignPrismaAdapter";
import { CampaignService } from "../CampaignService";
import { CampaignValidator } from "../CampaignValidator";
import { cleanCampaignDatabase, seedWorkspace } from "./testUtils";

const prisma = makeTestPrisma();
const campaignPrismaAdapter = new CampaignPrismaAdapter(prisma);
const campaignValidator = new CampaignValidator(prisma, campaignPrismaAdapter);

describe('CampaignValidator', () => {
  afterEach(async () => {
    await cleanCampaignDatabase(prisma);
    prisma.$disconnect();
  });

  test('it finds no problem if dialogue and workspace exists', async () => {
    await prisma.customer.create({
      data: {
        name: 'Test workspace',
        slug: 'test',
        id: 'TEST_WORKSPACE',
        dialogues: {
          create: {
            id: 'TEST_DIALOGUE',
            description: '',
            slug: 'Slug',
            title: 'Test Dialogue',
          }
        }
      }
    });

    const problems = await campaignValidator.validateCreateCampaignInput({
      workspaceId: 'TEST_WORKSPACE',
      variants: [{
        dialogueId: 'TEST_DIALOGUE',
        scheduleType: 'FOLLOW_UP',
        type: 'EMAIL',
        workspaceId: 'TEST_WORKSPACE'
      }]
    });

    expect(problems).toHaveLength(0);
  });

  test('it finds a problem if dialogue does not exists', async () => {
    await prisma.customer.create({
      data: {
        name: 'Test workspace',
        slug: 'test',
        id: 'TEST_WORKSPACE',
      }
    });

    const problems = await campaignValidator.validateCreateCampaignInput({
      workspaceId: 'TEST_WORKSPACE',
      variants: [{
        dialogueId: 'TEST_DIALOGUE',
        scheduleType: 'FOLLOW_UP',
        type: 'EMAIL',
        workspaceId: 'TEST_WORKSPACE'
      }]
    });

    expect(problems).toHaveLength(1);
    expect(problems[0].field).toEqual('dialogueId');
    expect(problems[0].problem).toEqual('DOES_NOT_EXIST')
  });
});