import * as https from 'https';
import { parse } from 'url';

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


export const sendToCallbackUrl = async (callbackUrl: string, payload: string) => {
  const {hostname, pathname} = parse(callbackUrl);

  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname,
      method: 'POST',
      path: pathname,
      headers: {
        'Content-Type': 'application/json',
      }
    }, (res) => {
      resolve('Success');
    });

    req.on('error', (e) => {
      console.error(e);
      reject(e.message);
    });

    // send the request
    req.write(JSON.stringify(payload));
    req.end();
  });
};
