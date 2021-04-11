import { parse } from 'querystring';

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

exports.main = async function(event: any, context: any) {
  try {
    if (!event.body) return { body: 'No body' };
    const body: TwilioBody = parse(event.body);

    if (body.MessageStatus === 'accepted' || body.MessageStatus === 'delivered') {
      console.log('Received! Update API next!');
    }

    if (body.MessageStatus === 'failed' || body.MessageStatus === 'undelivered') {
      console.log('Failed! Time to crash and burn!');
    }

    // We only accept GET for now
    return {
      statusCode: 200,
      headers: {},
      body: 'SMS has been handled'
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