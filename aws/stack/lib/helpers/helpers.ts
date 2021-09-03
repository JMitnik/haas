import fetch from 'node-fetch';

import { APIError } from './errors';

export const sendErrorToDynamo = async (
  dynamoClient: AWS.DynamoDB.DocumentClient,
  deliveryId: string,
  failureMessage: string,
  tableName: string = 'CampaignDeliveries',
  errorStatus: string = 'FAILED',
  from: string = '',
) => {
  const year = deliveryId.slice(0, 4);
  const month = deliveryId.slice(5, 7);
  const day = deliveryId.slice(8, 10);

  return dynamoClient.update({
    TableName: tableName,
    Key: {
      DeliveryDate: `${day}${month}${year}`,
      DeliveryDate_DeliveryID: deliveryId,
    },
    UpdateExpression: 'set DeliveryStatus = :status, DeliveryFailureMessage = :failureMessage',
    ExpressionAttributeValues: {
      ':status': errorStatus,
      ':failureMessage': failureMessage
    }
  }).promise();
}

export const updateDynamo = async (
  dynamoClient: AWS.DynamoDB.DocumentClient,
  deliveryId: string,
  status: string,
  tableName: string = 'CampaignDeliveries',
  from: string = '',
) => {
  const year = deliveryId.slice(0, 4);
  const month = deliveryId.slice(5, 7);
  const day = deliveryId.slice(8, 10);

  console.log({ from });
  console.log({status});

  return dynamoClient.update({
    TableName: tableName,
    Key: {
      DeliveryDate: `${day}${month}${year}`,
      DeliveryDate_DeliveryID: deliveryId,
    },
    UpdateExpression: 'set DeliveryStatus = :status',
    ExpressionAttributeValues: {
      ':status': status,
    }
  }).promise();
}


export const sendToCallbackUrl = async (callbackUrl: string, payload: any): Promise<any> => {
  console.log(JSON.stringify({payload}));
  const res = await fetch(callbackUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', },
    body: JSON.stringify(payload)
  });

  if (res.ok) { return await res.json(); }
  else {
    const msg = await res.text();
    throw new APIError(callbackUrl, msg);
  }
};

export const makeSuccessResponse = (message: string) => ({
  statusCode: 200,
  headers: {},
  body: message,
});

export const makeFailedResponse = (message: string) => ({
  statusCode: 400,
  headers: {},
  body: message,
});
