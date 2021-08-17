import { DeliveryStatusTypeEnum, Prisma } from '@prisma/client';
import faker from 'faker';

import { makeTestPrisma } from '../../../test/utils/makeTestPrisma';
import { CampaignService } from '../CampaignService';
import { SAMPLE_CAMPAIGN_SIMPLE, SAMPLE_DIALOGUE, SAMPLE_WORKSPACE } from './testData';
import { clearDatabase, prepData } from './testUtils';

import DynamoScheduleService from '../../../services/DynamoScheduleService';

jest.mock('../../../services/DynamoScheduleService', () => {
  return jest.fn().mockImplementation(() => {
      return {
        batchScheduleOneOffs: jest.fn(),
      }
    }
  )
});

const prisma = makeTestPrisma();
const dynamoScheduleService = new DynamoScheduleService();
const campaignService = new CampaignService(prisma, dynamoScheduleService);

const makeDelivery = (
  nrDeliveries: number,
  campaignId: string = '',
  variantId: string,
  status: DeliveryStatusTypeEnum,
  customVariables?: any,
): Prisma.DeliveryCreateInput[] => {
  return Array.from(Array(nrDeliveries)).map((nr => ({
    id: `TEST_DELIVERY_${faker.datatype.uuid()}`,
    scheduledAt: faker.date.future().toISOString(),
    deliveryRecipientFirstName: faker.name.firstName(),
    deliveryRecipientLastName: faker.name.lastName(),
    deliveryRecipientEmail: faker.internet.email(),
    deliveryRecipientPhone: faker.phone.phoneNumber(),
    campaign: { connect: { id: campaignId } },
    campaignVariant: { connect: { id: variantId } },
    currentStatus: status,
  })))
}


const DELIVERIES_A_SCHEDULED: Prisma.DeliveryCreateInput[] = makeDelivery(15, SAMPLE_CAMPAIGN_SIMPLE.id, 'TEST_VARIANT_1', 'SCHEDULED');
const DELIVERIES_B_SCHEDULED: Prisma.DeliveryCreateInput[] = makeDelivery(35, SAMPLE_CAMPAIGN_SIMPLE.id, 'TEST_VARIANT_2', 'SCHEDULED');
const DELIVERIES_A_DEPLOYED: Prisma.DeliveryCreateInput[] = makeDelivery(10, SAMPLE_CAMPAIGN_SIMPLE.id, 'TEST_VARIANT_1', 'DEPLOYED');
const DELIVERIES_B_DEPLOYED: Prisma.DeliveryCreateInput[] = makeDelivery(5, SAMPLE_CAMPAIGN_SIMPLE.id, 'TEST_VARIANT_2', 'DEPLOYED');

const ALL_DELIVERIES = [...DELIVERIES_A_SCHEDULED, ...DELIVERIES_B_SCHEDULED, ...DELIVERIES_A_DEPLOYED, ...DELIVERIES_B_DEPLOYED];

describe('CampaignService', () => {
  beforeEach(async () => {
    await prepData(
      prisma,
      SAMPLE_WORKSPACE,
      SAMPLE_DIALOGUE,
      SAMPLE_CAMPAIGN_SIMPLE,
      ALL_DELIVERIES
    );
  });

  afterEach(async () => {
    await clearDatabase(prisma);
    await prisma.$disconnect();
  });

  test('test?', async () => {
    await dynamoScheduleService.batchScheduleOneOffs([], { tableName: '' });
  });

  test('it fetches 10 out of 50 deliveries', async () => {
    const deliveryPagination = await campaignService.getPaginatedDeliveries(
      SAMPLE_CAMPAIGN_SIMPLE.id as string,
      { limit: 10 },
    );

    expect(deliveryPagination.entries.length).toBe(10);
  });

  test('it fetches only variant B', async () => {
    const deliveryPagination = await campaignService.getPaginatedDeliveries(
      SAMPLE_CAMPAIGN_SIMPLE.id as string,
      {},
      { variantId: 'TEST_VARIANT_2' }
    );

    expect(deliveryPagination.entries.length).toBe(35 + 5);
  });

  test('it fetches only deployed', async () => {
    const deliveryPagination = await campaignService.getPaginatedDeliveries(
      SAMPLE_CAMPAIGN_SIMPLE.id as string,
      {},
      { status: 'DEPLOYED' }
    );

    expect(deliveryPagination.entries.length).toBe(10 + 5);
  });

  test('it invalidates a random entry correctly', async () => {
    const campaign = await campaignService.findCampaign(SAMPLE_CAMPAIGN_SIMPLE?.id || '');
    const { erroredRecords } = campaignService.validateDeliveryRows(
      [{ test: 'test' }],
      // @ts-ignore
      campaign?.variantsEdges.map(edge => ({
        // @ts-ignore
        ...edge.campaignVariant,
        // @ts-ignore
        type: 'EMAIL',
      }))
    );
    expect(erroredRecords).toHaveLength(1);
  });

  test('it validates a good entry correctly, and checks custom variables', async () => {
    const campaign = await campaignService.createCampaign({
      workspaceId: SAMPLE_WORKSPACE?.id || '',
      label: 'Test',
      variants: [{
        weight: 100,
        customVariables: [{
          key: 'energyLabel'
        }],
        dialogueId: SAMPLE_DIALOGUE?.id || '',
        type: 'QUEUE',
        workspaceId: SAMPLE_WORKSPACE?.id || '',
        body: 'Dear {{ firstName }}, happy to hear you join us at {{ energyLabel }}.',
      }],
    });

    const { successRecords, erroredRecords } = campaignService.validateDeliveryRows(
      [{ email: 'jason@jason.com', age: 22, energyLabel: 'Test'  }],
      campaign?.variantsEdges.map(edge => ({
        ...edge.campaignVariant,
        type: 'EMAIL',
      }))
    );

    expect(erroredRecords).toHaveLength(0);
    expect(successRecords[0]).not.toHaveProperty('age');
    expect(successRecords[0]).toHaveProperty('energyLabel');

    // @ts-ignore
    expect(successRecords[0]['energyLabel']).toEqual('Test');
  });

  test('can extract custom variables', async () => {
    const campaign = await campaignService.createCampaign({
      workspaceId: SAMPLE_WORKSPACE?.id || '',
      label: 'Test',
      variants: [{
        weight: 100,
        customVariables: [{
          key: 'energyLabel'
        }],
        dialogueId: SAMPLE_DIALOGUE?.id || '',
        type: 'QUEUE',
        workspaceId: SAMPLE_WORKSPACE?.id || '',
        body: 'Dear {{ firstName }}, happy to hear you join us at {{ energyLabel }}.',
      }],
    });

    const records = [{
      firstName: 'Joseph',
      lastName: 'Joestar',
      age: 32,
      energyLabel: 'Private Corp',
    }];

    const customVariables = campaignService.extractCustomVariablesFromCSVRecord(
      campaign.variantsEdges?.map(edge => edge.campaignVariant),
      records[0]
    );

    expect(customVariables).toHaveProperty('energyLabel')
    expect(customVariables['energyLabel']).toEqual('Private Corp');
    expect(customVariables).not.toHaveProperty('age');
  });

  test('can render body correctly with custom variable', async () => {
    const campaign = await campaignService.createCampaign({
      workspaceId: SAMPLE_WORKSPACE?.id || '',
      label: 'Test',
      variants: [{
        weight: 100,
        customVariables: [{
          key: 'energyLabel'
        }],
        dialogueId: SAMPLE_DIALOGUE?.id || '',
        type: 'QUEUE',
        workspaceId: SAMPLE_WORKSPACE?.id || '',
        body: 'Dear {{ firstName }}, happy to hear you join us at {{ energyLabel }}.',
      }],
    });

    const records = [{
      firstName: 'Joseph',
      lastName: 'Joestar',
      age: 32,
      energyLabel: 'Private Corp',
    },
    {
      firstName: 'Josuke',
      lastName: 'Joestar',
    }];

    const bodies = records.map(record => {
      const customVariables = campaignService.extractCustomVariablesFromCSVRecord(
        campaign.variantsEdges?.map(edge => edge.campaignVariant),
        record
      );

      const body = campaignService.renderBody(
        campaign.variantsEdges[0].campaignVariant.body,
        { firstName: record.firstName, ...customVariables }
      );
      return body;
    });

    expect(bodies[0]).toEqual('Dear Joseph, happy to hear you join us at Private Corp.');
    expect(bodies[1]).toEqual('Dear Josuke, happy to hear you join us at .');
  });

  test('can create a batch of new deliveries, and checks that it tries to send to dynamo', async () => {
    const campaign = await campaignService.createCampaign({
      workspaceId: SAMPLE_WORKSPACE?.id || '',
      label: 'Test',
      variants: [{
        weight: 100,
        customVariables: [{
          key: 'energyLabel'
        }],
        dialogueId: SAMPLE_DIALOGUE?.id || '',
        type: 'QUEUE',
        workspaceId: SAMPLE_WORKSPACE?.id || '',
        body: 'Dear {{ firstName }}, happy to hear you join us at {{ energyLabel }}.',
      }],
    });

    const records = [{
      firstName: 'Joseph',
      lastName: 'Joestar',
      age: 32,
      energyLabel: 'Private Corp',
    },
    {
      firstName: 'Josuke',
      lastName: 'Joestar',
    }];

    const deliveryStats = await campaignService.createBatchDeliveries(
      campaign.id,
      records,
      new Date("2021-08-17").toISOString(),
      ''
    );

    const campaignWithDeliveries = await campaignService.findCampaign(campaign.id);
    expect(campaignWithDeliveries.deliveries.length).toEqual(2);

    expect(campaignService.dynamoScheduleService.batchScheduleOneOffs).toHaveBeenCalledTimes(1);
    expect(campaignService.dynamoScheduleService.batchScheduleOneOffs).toHaveBeenCalledWith(
      [{"attributes": [{"key": "DeliveryDate", "type": "string", "value": "17082021"}, {"key": "DeliveryDate_DeliveryID", "type": "string", "value": expect.any(String)}, {"key": "DeliveryRecipient", "type": "string", "value": ""}, {"key": "DeliveryBody", "type": "string", "value": "Dear Joseph, happy to hear you join us at Private Corp."}, {"key": "DeliveryFrom", "type": "string", "value": ""}, {"key": "DeliveryStatus", "type": "string", "value": "SCHEDULED"}, {"key": "DeliveryType", "type": "string", "value": "QUEUE"}, {"key": "callback", "type": "string", "value": ""}, {"key": "phoneNumber", "type": "string", "value": ""}]}, {"attributes": [{"key": "DeliveryDate", "type": "string", "value": "17082021"}, {"key": "DeliveryDate_DeliveryID", "type": "string", "value": expect.any(String)}, {"key": "DeliveryRecipient", "type": "string", "value": ""}, {"key": "DeliveryBody", "type": "string", "value": "Dear Josuke, happy to hear you join us at ."}, {"key": "DeliveryFrom", "type": "string", "value": ""}, {"key": "DeliveryStatus", "type": "string", "value": "SCHEDULED"}, {"key": "DeliveryType", "type": "string", "value": "QUEUE"}, {"key": "callback", "type": "string", "value": ""}, {"key": "phoneNumber", "type": "string", "value": ""}]}],
      {"tableName": "CampaignDeliveries"}
    );
  });
});
