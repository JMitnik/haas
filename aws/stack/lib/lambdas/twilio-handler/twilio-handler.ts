import { parse } from 'querystring';
import * as AWS from 'aws-sdk';

const dynamoClient = new AWS.DynamoDB.DocumentClient();

interface TwilioBody {
  SmsSid?: string;
  SmsStatus?: string;
  MessageStatus?: 'accepted' | 'queued' | 'delivered' | 'failed' | 'undelivered';
  To?: string;
  MessagingServiceSid?: string;
  MessageSid?: string;
  From?: string;
  ApiVersion?: string;
  AccountSid?: string;
}

const TABLE_NAME = 'CampaignDeliveries';

exports.main = async function (event: any, context: any) {
  try {
    if (!event.body) return { body: 'No body' };
    const body: TwilioBody = parse(event.body);

    if (!event.queryStringParameters?.deliveryId) {
      console.error("No queryStringParamers found for delivery-id. Can't update status");
      return {
        statusCode: 400,
        headers: {},
        body: 'SMS received, but delivery was not updated'
      }
    }

    const dateDeliveryId = event.queryStringParameters?.deliveryId;
    const year = dateDeliveryId.slice(0, 4);
    const month = dateDeliveryId.slice(5, 7);
    const day = dateDeliveryId.slice(8, 10);
    let status = '';

    switch(body.MessageStatus) {
      case 'accepted': {
        status = 'DELIVERED';
        break;
      }
      case 'delivered': {
        status = 'DELIVERED';
        break;
      }
      case 'failed': {
        status = 'ERRORED';
        break;
      }
      case 'undelivered': {
        status = 'ERRORED';
        break;
      }
    }

    if (body.MessageStatus === 'accepted' || body.MessageStatus === 'delivered') {
      status = 'DELIVERED';
    }

    if (body.MessageStatus === 'failed' || body.MessageStatus === 'undelivered') {
      console.error(`Something went wrong for ${dateDeliveryId}`);
      status = 'ERRORED';
    }

    try {
      await dynamoClient.update({
        TableName: TABLE_NAME,
        Key: {
          DeliveryDate: `${day}${month}${year}`,
          DeliveryDate_DeliveryID: dateDeliveryId,
        },
        UpdateExpression: 'set DeliveryStatus = :status',
        ExpressionAttributeValues: {
          ':status': status,
        }
      }).promise();
    }
    catch (error) {
      console.error(`Unable to update dynamo during positive update: ${JSON.stringify(error, null, 2)}`);

      return {
        statusCode: 400,
        headers: {},
        body: JSON.stringify(error)
      };
    }

    return {
      statusCode: 200,
      headers: {},
      body: 'SMS has been handled'
    };
  } catch (error) {
    var body = error.stack || JSON.stringify(error, null, 2);

    return {
      statusCode: 400,
      headers: {},
      body: JSON.stringify(body)
    };
  }
}
