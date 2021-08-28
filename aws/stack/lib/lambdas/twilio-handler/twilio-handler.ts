import { parse } from 'querystring';
import * as AWS from 'aws-sdk';
import { sendErrorToDynamo } from '../../helpers/helpers';

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
      throw new Error('No queryStringParamers found for delivery-id. Can\'t update status');
    }

    const dateDeliveryId = event.queryStringParameters?.deliveryId;
    const year = dateDeliveryId.slice(0, 4);
    const month = dateDeliveryId.slice(5, 7);
    const day = dateDeliveryId.slice(8, 10);
    let status = '';

    if (body.MessageStatus === 'accepted' || body.MessageStatus === 'delivered') {
      status = 'DELIVERED';

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

    if (body.MessageStatus === 'failed' || body.MessageStatus === 'undelivered') {
      status = 'FAILED';

      await sendErrorToDynamo(dynamoClient, dateDeliveryId, `SendError: SMS Failed, according to ${body}`);
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
      throw new Error(`Unable to update dynamo during positive update: ${JSON.stringify(error, null, 2)}`);
    }

    return {
      statusCode: 200,
      headers: {},
      body: 'SMS has been handled'
    };
  } catch (error) {
    var errBody = error.stack || JSON.stringify(error, null, 2);
    throw new Error(`Unknown update ${errBody}`);
  }
}
