import { Prisma } from "@prisma/client";
import prisma from "../../../config/prisma";
import faker from 'faker';
import { CampaignService } from "../CampaignService";

const SAMPLE_WORKSPACE: Prisma.CustomerCreateInput = {
  id: 'TEST_WORKSPACE',
  name: 'Test workspace',
  slug: 'test_workspace',
}

const SAMPLE_DIALOGUE: Prisma.DialogueCreateInput = {
  id: 'TEST_DIALOGUE',
  customer: { connect: { id: SAMPLE_WORKSPACE.id } },
  description: '',
  slug: 'test_dialogue',
  title: 'Test Dialogue',
}

const SAMPLE_CAMPAIGN: Prisma.CampaignCreateInput = {
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

// TODO: Make DRY
const NR_DELIVERIES_A = 15;

const SAMPLE_DELIVERIES_A: Prisma.DeliveryCreateInput[] = Array.from(Array(NR_DELIVERIES_A)).map((nr) => ({
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

const NR_DELIVERIES_B = 35;

const SAMPLE_DELIVERIES_B: Prisma.DeliveryCreateInput[] = Array.from(Array(NR_DELIVERIES_B)).map((nr) => ({
  id: `TEST_DELIVERY_${faker.random.uuid()}`,
  scheduledAt: faker.date.future().toISOString(),
  deliveryRecipientFirstName: faker.name.firstName(),
  deliveryRecipientLastName: faker.name.lastName(),
  deliveryRecipientEmail: faker.internet.email(),
  deliveryRecipientPhone: faker.phone.phoneNumber(),
  campaign: { connect: { id: SAMPLE_CAMPAIGN.id } },
  campaignVariant:{ connect: { id: 'TEST_VARIANT_2' } },
  currentStatus: 'SCHEDULED',
}));

const NR_DELIVERIES_DEPLOYED_AND_A = 10;

const SAMPLE_DELIVERIES_DEPLOYED_AND_A: Prisma.DeliveryCreateInput[] = Array.from(Array(NR_DELIVERIES_DEPLOYED_AND_A)).map((nr) => ({
  id: `TEST_DELIVERY_${faker.random.uuid()}`,
  scheduledAt: faker.date.future().toISOString(),
  deliveryRecipientFirstName: faker.name.firstName(),
  deliveryRecipientLastName: faker.name.lastName(),
  deliveryRecipientEmail: faker.internet.email(),
  deliveryRecipientPhone: faker.phone.phoneNumber(),
  campaign: { connect: { id: SAMPLE_CAMPAIGN.id } },
  campaignVariant:{ connect: { id: 'TEST_VARIANT_1' } },
  currentStatus: 'DEPLOYED',
}));

const NR_DELIVERIES_DEPLOYED_AND_B = 5;

const SAMPLE_DELIVERIES_DEPLOYED_AND_B: Prisma.DeliveryCreateInput[] = Array.from(Array(NR_DELIVERIES_DEPLOYED_AND_B)).map((nr) => ({
  id: `TEST_DELIVERY_${faker.random.uuid()}`,
  scheduledAt: faker.date.future().toISOString(),
  deliveryRecipientFirstName: faker.name.firstName(),
  deliveryRecipientLastName: faker.name.lastName(),
  deliveryRecipientEmail: faker.internet.email(),
  deliveryRecipientPhone: faker.phone.phoneNumber(),
  campaign: { connect: { id: SAMPLE_CAMPAIGN.id } },
  campaignVariant:{ connect: { id: 'TEST_VARIANT_2' } },
  currentStatus: 'DEPLOYED',
}));

const ALL_DELIVERIES = [...SAMPLE_DELIVERIES_A, ...SAMPLE_DELIVERIES_B, ...SAMPLE_DELIVERIES_DEPLOYED_AND_A, ...SAMPLE_DELIVERIES_DEPLOYED_AND_B];


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
      const deliveries = await Promise.all(ALL_DELIVERIES.map(async (SAMPLE_DELIVERY) => {
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

describe('CampaignService:pagination', () => {
  test('it fetches 10 out of 50 deliveries', async () => {
    const deliveryPagination = await CampaignService.getPaginatedDeliveries(
      SAMPLE_CAMPAIGN.id as string,
      { limit: 10 },
    );

    expect(deliveryPagination.entries.length).toBe(10);
  });

  test('it fetches only variant B', async () => {
    const deliveryPagination = await CampaignService.getPaginatedDeliveries(
      SAMPLE_CAMPAIGN.id as string,
      {  },
      { variantId: 'TEST_VARIANT_2' }
    );

    expect(deliveryPagination.entries.length).toBe(NR_DELIVERIES_B + NR_DELIVERIES_DEPLOYED_AND_B);
  });

  test('it fetches only deployed', async () => {
    const deliveryPagination = await CampaignService.getPaginatedDeliveries(
      SAMPLE_CAMPAIGN.id as string,
      {  },
      { status: 'DEPLOYED' }
    );

    expect(deliveryPagination.entries.length).toBe(NR_DELIVERIES_DEPLOYED_AND_A + NR_DELIVERIES_DEPLOYED_AND_B);
  });
});
