import * as AWS from 'aws-sdk';
import { Twilio } from 'twilio';

const twilioSid = process.env.TWILIO_ACCOUNT_SID as string;
const twilioToken = process.env.TWILIO_AUTH_TOKEN as string;
const twilioServiceSID = process.env.TWILIO_MESSAGE_SERVICE_SID as string;

const twilioClient = new Twilio(twilioSid, twilioToken);

exports.main = async function(event: any, context: any) {
  try {
    const ssmClient = new AWS.SSM();
    const param = await ssmClient.getParameter({
      Name: 'TWILIO_CALLBACK_URL'
    }).promise();
    const callbackUrl = param.Parameter?.Value;

    if (!callbackUrl) {
      console.log("Not found");
      return {
        statusCode: 400,
        body: 'No callback url found',
      };
    }

    // We only accept GET for now
    const createMessage = await twilioClient.messages.create({
      to: '+31640440373',
      body: 'Test',
      messagingServiceSid: twilioServiceSID,
      statusCallback: `${callbackUrl}?id=test123`,
    });

    return {
      statusCode: 200,
      headers: {},
      body: 'SMS has been sent.'
    };
  } catch(error) {
    var body = error.stack || JSON.stringify(error, null, 2);
    return {
      statusCode: 400,
        headers: {},
        body: JSON.stringify(body)
    }
  }
}