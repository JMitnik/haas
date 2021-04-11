import * as AWS from 'aws-sdk';
import { Twilio } from 'twilio';

const twilioSid = process.env.TWILIO_ACCOUNT_SID as string;
const twilioToken = process.env.TWILIO_AUTH_TOKEN as string;
const twilioServiceSID = process.env.TWILIO_MESSAGE_SERVICE_SID as string;

const twilioClient = new Twilio(twilioSid, twilioToken);

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
}

exports.main = async function(event: any, context: any) {
  try {
    let phoneNumber = '';
    let body = '';
    let deliveryId = '';

    // TODO: Maybe loop over records?
    if (!event?.Records[0]?.Sns?.Message) {
      console.error(`No record found for ${event?.Records[0]?.Sns}`)
      return missingNotificationResponse;
    }

    const message: MessageProps = JSON.parse(event?.Records[0]?.Sns?.Message);
    if (!message?.body || !message?.PhoneNumber || !message?.deliveryId) {
      console.error(`Not all required properties found in message ${JSON.stringify(message)}`);
      console.dir(message, { depth: null });
      return missingNotificationResponse;
    }
    phoneNumber = message.PhoneNumber;
    body = message.body;
    deliveryId = message.deliveryId;

    const callbackUrlParam = await ssmClient.getParameter({
      Name: 'TWILIO_CALLBACK_URL'
    }).promise();
    const callbackUrl = callbackUrlParam.Parameter?.Value;

    if (!callbackUrl) {
      console.error(`No callback url found found ${callbackUrlParam.Parameter}`);
      return missingCallbackUrl;
    }

    await twilioClient.messages.create({
      to: phoneNumber,
      body,
      messagingServiceSid: twilioServiceSID,
      statusCallback: `${stripTrailingSlash(callbackUrl)}?deliveryId=${deliveryId}`,
    });

    return successMessage;
  } catch(error) {
    var body = error.stack || JSON.stringify(error, null, 2);

    return {
      statusCode: 400,
      headers: {},
      body: JSON.stringify(body)
    }
  }
}