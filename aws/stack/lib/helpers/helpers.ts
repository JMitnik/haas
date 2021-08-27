import fetch from 'node-fetch';

export const sendErrorToDynamo = async (
  dynamoClient: AWS.DynamoDB.DocumentClient,
  deliveryId: string,
  errorMessage: string,
  tableName: string = 'CampaignDeliveries',
  errorStatus: string ='ERRORED'
) => {
  const year = deliveryId.slice(0, 4);
  const month = deliveryId.slice(5, 7);
  const day = deliveryId.slice(8, 10);

  console.log({ deliveryId, errorMessage, tableName, errorStatus });

  return dynamoClient.update({
    TableName: tableName,
    Key: {
      DeliveryDate: `${day}${month}${year}`,
      DeliveryDate_DeliveryID: deliveryId,
    },
    UpdateExpression: 'set DeliveryStatus = :status, DeliveryError = :errorMessage',
    ExpressionAttributeValues: {
      ':status': errorStatus,
      ':errorMessage': errorMessage
    }
  }).promise();
}


export const sendToCallbackUrl = async (callbackUrl: string, payload: any) => {
  return fetch(callbackUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload)
  });
};
