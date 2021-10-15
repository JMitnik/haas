import * as AWS from 'aws-sdk';
import { PromiseResult } from 'aws-sdk/lib/request';
import { format, parse } from 'date-fns';

const dbClient = new AWS.DynamoDB.DocumentClient({
  endpoint: process.env.AWS_SAM_LOCAL ? 'http://host.docker.internal:8000' : undefined,
});

const TABLE_NAME = 'CampaignDeliveries';

interface Delivery {
  phoneNumber: string;
  DeliveryFrom: string;
  DeliveryRecipient: string;
  callback: string;
  DeliveryDate_DeliveryID: string;
  DeliveryBody: string;
  DeliveryType: string;
  DeliveryStatus: string;
  DeliveryDate: string;
}

exports.lambdaHandler = async () => {
  try {
    const endDate = Date.now();
    const scheduledItems = await queryPendingScheduledItems(endDate);

    if (scheduledItems.length > 0) {
      console.log(`Will deploy ${scheduledItems.length} items`);
    }

    const updatedPendingItems = await updatePendingItems(scheduledItems);
    return updatedPendingItems;
  } catch (err) {
    console.error(err);
    return err;
  }
};

/**
 * Set SCHEDULED items to have a status of DEPLOYED.
 *
 * - This will trigger a DynamoDB Stream, which will be handled by another Lambda.
 * @param items
 * @returns
 */
const updatePendingItems = async (
  items: AWS.DynamoDB.ItemList
): Promise<PromiseResult<AWS.DynamoDB.DocumentClient.UpdateItemOutput, AWS.AWSError>[]> => {
  const updates = items.map((item) => dbClient.update({
    TableName: TABLE_NAME,
    Key: {
      DeliveryDate: item.DeliveryDate,
      DeliveryDate_DeliveryID: item.DeliveryDate_DeliveryID,
    },
    UpdateExpression: 'set DeliveryStatus = :status',
    ExpressionAttributeValues: {
      ':status': 'DEPLOYED',
    },
  }).promise());

  return await Promise.all(updates);
}

/**
 * Query SCHEDULED items which have a delivery-date before NOW.
 *
 * - Does this for `maxItems` items. The idea is that we only handle a number of items a time (so that we don't perform
 *   for example 300 writes at a time). At the next scheduled lambda call, we handle the next `maxItems`.
 */
const queryPendingScheduledItems = async (
  endDateTimestamp: Date | number,
  maxItems: number = 100
): Promise<AWS.DynamoDB.ItemList> => {
  const dynamoDate = format(endDateTimestamp, 'ddMMyyyy');

  // Construct query which looks for SCHEDULED items before `now`.
  const params: AWS.DynamoDB.DocumentClient.QueryInput = {
    TableName: TABLE_NAME,
    KeyConditionExpression: 'DeliveryDate = :date AND DeliveryDate_DeliveryID < :now',
    FilterExpression: 'DeliveryStatus = :deployedStatus',
    ExpressionAttributeValues: {
      ':deployedStatus': 'SCHEDULED',
      ':date': `${dynamoDate}`,
      ':now': `${new Date(endDateTimestamp).toISOString()}`,
    },
  };

  const query = new Promise((resolve, reject) => {
    dbClient.query(params, ((err, data) => {
      if (err) {
        console.error(`An error: ${err}`);
        reject(err);
      } else {
        console.log(`Fetched ${(data.Items || []).length} items!`);
        resolve(data);
      }
    }));
  });

  const results = await query as AWS.DynamoDB.QueryOutput;
  const items = results?.Items || [];

  if (items.length > 0) {
    const numberItems = Math.min(items.length, maxItems);
    return items.slice(0, numberItems);
  }

  return items;
}
