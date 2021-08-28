import { parse } from 'querystring';
import * as AWS from 'aws-sdk';
import { sendErrorToDynamo, updateDynamo } from '../../helpers/helpers';

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
    // Validate input
    if (!event.body) return { body: 'No body' };
    const body: TwilioBody = parse(event.body);
    if (!event.queryStringParameters?.deliveryId) {
      throw new Error('No queryStringParamers found for delivery-id. Can\'t update status');
    }

    // Parse input
    const dateDeliveryId = event.queryStringParameters?.deliveryId;

    // If SMS is accepted => Dynamo as DELIVERED
    if (body.MessageStatus === 'accepted' || body.MessageStatus === 'delivered') {
      await updateDynamo(dynamoClient, dateDeliveryId, 'DELIVERED', TABLE_NAME, 'twilioHandle--success');
    }

    // // If SMS is failed => Dynamo as failure
    if (body.MessageStatus === 'failed' || body.MessageStatus === 'undelivered') {
      await sendErrorToDynamo(
        dynamoClient,
        dateDeliveryId,
        `SendError: SMS Failed, according to ${body}`,
        'twilioHandle--Failed'
      );
    }

    return { statusCode: 200, headers: {}, body: 'SMS has been handled' };
  } catch (error) {
    var errBody = error.stack || JSON.stringify(error, null, 2);
    throw new Error(`Unknown update ${errBody}`);
  }
}
