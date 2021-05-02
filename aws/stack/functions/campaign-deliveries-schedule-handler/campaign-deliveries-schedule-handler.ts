import * as AWS from 'aws-sdk';
import { format } from 'date-fns';
import { Context, ScheduledEvent } from 'aws-lambda';

export interface DeliveryItem {
  DeliveryDate: string;
  DeliveryDate_DeliveryID: string;
}

const deliveryTableName = process.env.deliveryTableName as string;

export const lambdaHandler = async (event?: ScheduledEvent, context?: Context) => {
  const dbClient = new AWS.DynamoDB.DocumentClient({
    endpoint: process.env.AWS_SAM_LOCAL ? 'http://host.docker.internal:8000' : undefined,
  });

  try {
    const now = Date.now();
    const date = format(now, 'ddMMyyyy');

    const queryParams = {
      TableName: deliveryTableName || '',
      KeyConditionExpression: 'DeliveryDate = :date AND DeliveryDate_DeliveryID < :now',
      FilterExpression: 'DeliveryStatus = :deployedStatus',
      ExpressionAttributeValues: {
        ':deployedStatus': 'SCHEDULED',
        ':date': `${date}`,
        ':now': `${new Date(now).toISOString()}`,
      },
    };

    let items: DeliveryItem[] = [];

    try {
      const dataResults = await dbClient.query(queryParams).promise();
      if (!dataResults?.Items?.length) {return;}
      items = dataResults.Items as DeliveryItem[];
    } catch (error) {
      console.error(`Erroring when querying the database: ${error}`);
      throw error;
    }

    const tableUpdates = items.map((item) => dbClient.update({
      TableName: deliveryTableName,
      Key: {
        DeliveryDate: item.DeliveryDate,
        DeliveryDate_DeliveryID: item.DeliveryDate_DeliveryID,
      },
      UpdateExpression: 'set DeliveryStatus = :status',
      ExpressionAttributeValues: {
        ':status': 'DEPLOYED',
      },
    }).promise());

    // Wait for all the items to have finished updating
    await Promise.all(tableUpdates);
    console.log(`${tableUpdates.length} items have been deployed!`)
  } catch (err) {
    console.log(err);
    return err;
  }
};

exports.lambdaHandler = lambdaHandler;