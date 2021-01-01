import { CampaignCreateInput, CustomerCreateInput, DeliveryCreateInput, DialogueCreateInput } from "@prisma/client";
import prisma from "../../../config/prisma";
import faker from 'faker';
import { CampaignService } from "../CampaignService";

const SAMPLE_WORKSPACE: CustomerCreateInput = {
  id: 'TEST_WORKSPACE',
  name: 'Test workspace',
  slug: 'test_workspace',
}

const SAMPLE_DIALOGUE: DialogueCreateInput = {
  id: 'TEST_DIALOGUE',
  customer: { connect: { id: SAMPLE_WORKSPACE.id } },
  description: '',
  slug: 'test_dialogue',
  title: 'Test Dialogue',
}

const SAMPLE_CAMPAIGN: CampaignCreateInput = {
  id: 'TEST_CAMPAIGN',
  label: 'test',
  workspace: { connect: { id: SAMPLE_WORKSPACE.id } },
  variantsEdges: {
    create: [{
      weight: 50,
      campaignVariant: {
        create: {
          id: 'TEST_VARIANT_1',
          body: 'Dear {{ firstName }}, how are you?',
          dialogue: { connect: { id: SAMPLE_DIALOGUE.id } },
          label: 'Test Campaign',
          type: 'QUEUE',
          workspace: { connect: { id: SAMPLE_WORKSPACE.id } },
        }
      }
    }, {
        weight: 50,
        campaignVariant: {
          create: {
            id: 'TEST_VARIANT_2',
            body: 'Dear {{ firstName }}, how are you?',
            dialogue: { connect: { id: SAMPLE_DIALOGUE.id } },
            label: 'Test Campaign',
            type: 'QUEUE',
            workspace: { connect: { id: SAMPLE_WORKSPACE.id } },
          }
        }
    }]
  }
};

const NR_DELIVERIES = 50;

const SAMPLE_DELIVERIES: DeliveryCreateInput[] = Array.from(Array(NR_DELIVERIES)).map((nr) => ({
  id: `TEST_DELIVERY_${faker.random.uuid()}`,
  scheduledAt: faker.date.future().toISOString(),
  deliveryRecipientFirstName: faker.name.firstName(),
  deliveryRecipientLastName: faker.name.lastName(),
  deliveryRecipientEmail: faker.internet.email(),
  deliveryRecipientPhone: faker.phone.phoneNumber(),
  campaign: { connect: { id: SAMPLE_CAMPAIGN.id } },
  campaignVariant:{ connect: { id: 'TEST_VARIANT_1' } },
  currentStatus: 'SCHEDULED',
}));


beforeAll(async () => {
  if (process.env.NODE_ENV === 'test') {
    try {
      const createCustomer = await prisma.customer.create({
        data: SAMPLE_WORKSPACE
      });
    } catch (e) {
      console.log(e);
    }

    try {
      const createDialogue = await prisma.dialogue.create({
        data: SAMPLE_DIALOGUE
      }); 
    } catch (error) {
      console.log(error);
    }

    try {
      const createCampaign = await prisma.campaign.create({
        data: SAMPLE_CAMPAIGN
      }); 
    } catch (error) {
      console.log(error);
    }

    try {
      const deliveries = await Promise.all(SAMPLE_DELIVERIES.map(async (SAMPLE_DELIVERY) => {
        await prisma.delivery.create({
          data: SAMPLE_DELIVERY
        }); 
      }));
    } catch (error) {
      console.log(error);
    }

    console.log("PREPARATION: Created all input!");
    console.log("===============================");
  }
});

afterAll(async () => {
  if (process.env.NODE_ENV === 'test') {
    try {
      await prisma.delivery.deleteMany({
        where: { campaignId: SAMPLE_CAMPAIGN.id }
      });
    } catch (error) {
      console.log(error);
    }
    try {
      const removeCampaignVariant = await prisma.campaignVariantToCampaign.deleteMany({
        where: { campaignId: SAMPLE_CAMPAIGN.id }
      });
    } catch (error) {
      console.log(error);
    }
  
    try {
      const removeCampaignVariant = await prisma.campaignVariant.deleteMany({
        where: { id: { startsWith: 'TEST_VARIANT'} }
      });
    } catch (error) {
      console.log(error);
    }
  
    try {
      const removeCampaign = await prisma.campaign.delete({
        where: {  id: SAMPLE_CAMPAIGN.id },
      });
      
    } catch (error) {
      console.log(error);
    }
  
    try {
      const removeDialogue = await prisma.dialogue.delete({
        where: { id: SAMPLE_DIALOGUE.id },
      });
  
    } catch (error) {
      console.log(error);
    }
  
    try {
      const removeWorkspace = await prisma.customer.delete({
        where: { id: SAMPLE_WORKSPACE.id },
      });
    } catch (error) {
      console.log(error);
    }
  }

  await prisma.$disconnect();

  console.log("STOPPED: Removed input");
  console.log("===============================");
});

describe('CampaignService', () => {
  test('it fetches campaign', async () => {
    const test = await prisma.campaign.findFirst({
      where: { id: SAMPLE_CAMPAIGN.id }
    });
  
    expect(test.label).toBe(SAMPLE_CAMPAIGN.label);
  });

  test('fetch 10 deliveries', async () => {
    const deliveryPagination = await CampaignService.getPaginatedDeliveries(
      SAMPLE_CAMPAIGN.id as string, 
      { limit: 10 }
    );

    expect(deliveryPagination.entries.length).toBe(10);
  });
});