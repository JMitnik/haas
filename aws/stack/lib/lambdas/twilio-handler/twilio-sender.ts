import * as AWS from 'aws-sdk';
import { Twilio } from 'twilio';
import { sendErrorToDynamo } from '../../helpers/helpers';

const twilioSid = process.env.TWILIO_ACCOUNT_SID as string;
const twilioToken = process.env.TWILIO_AUTH_TOKEN as string;
const twilioServiceSID = process.env.TWILIO_MESSAGE_SERVICE_SID as string;

const twilioClient = new Twilio(twilioSid, twilioToken);
const dynamoClient = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = 'CampaignDeliveries';

const missingNotificationResponse = {
  statusCode: 400,
  headers: {},
  body: 'No Sns message found'
};

const missingCallbackUrl = {
  statusCode: 400,
  headers: {},
  body: 'No callback passed'
};

const errorSmsSendResponse = {
  statusCode: 400,
  headers: {},
  body: 'SMS errored out'
};

const genericErrorResponse = {
  statusCode: 400,
  headers: {},
  body: 'General error'
};

const successMessage = {
  statusCode: 200,
  headers: {},
  body: 'SMS has been sent!'
};

const ssmClient = new AWS.SSM();

function stripTrailingSlash(str: string) {
  if(str.substr(-1) === '/') {
      return str.substr(0, str.length - 1);
  }
  return str;
}

interface MessageProps {
  body: string;
  PhoneNumber: string;
  deliveryId: string;
  from: string;
}

exports.main = async function(event: any, context: any) {
  try {
    let phoneNumber = '';
    let body = '';
    let deliveryId = '';
    let from = '';

    // TODO: Maybe loop over records?
    if (!event?.Records[0]?.Sns?.Message) {
      console.error(`No record found for ${event?.Records[0]?.Sns}`)
      return missingNotificationResponse;
    }
    const message: MessageProps = JSON.parse(event?.Records[0]?.Sns?.Message);

    // Parse body from the message

    // If no message, phone number or no delivery id is provided, we fail
    if (!message?.body || !message?.PhoneNumber || !message?.deliveryId) {
      console.error(`Not all required properties found in message ${JSON.stringify(message)}`);
      console.dir(message, { depth: null });
      return missingNotificationResponse;
    }

    // Set properties
    phoneNumber = message.PhoneNumber;
    body = message.body;
    deliveryId = message.deliveryId;
    from = message.from || 'haas';

    // Get the url for callback purposes
    const callbackUrlParam = await ssmClient.getParameter({
      Name: 'TWILIO_CALLBACK_URL'
    }).promise();
    const callbackUrl = callbackUrlParam.Parameter?.Value;

    if (!callbackUrl) {
      console.error(`No callback url found found ${callbackUrlParam.Parameter}`);
      return missingCallbackUrl;
    }

    try {
      // Send message to twilio
      await twilioClient.messages.create({
        to: phoneNumber,
        body,
        from,
        messagingServiceSid: twilioServiceSID,
        statusCallback: `${stripTrailingSlash(callbackUrl)}?deliveryId=${deliveryId}`,
      });
    } catch (error) {
      console.error(error);

      await sendErrorToDynamo(dynamoClient, deliveryId, `SendError: SMS Failed to send due to ${JSON.stringify(error)}`);
      return errorSmsSendResponse;
    }

    console.log("Message success!");

    return successMessage;
  } catch(error) {
    var errorBody = error.stack || JSON.stringify(error, null, 2);
    console.error(errorBody);

    return genericErrorResponse;
  }
}
