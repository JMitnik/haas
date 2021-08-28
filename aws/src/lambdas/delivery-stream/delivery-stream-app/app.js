const AWS = require('aws-sdk');
const https = require('https');
const URL = require('url');

const sesClient = new AWS.SES();
const snsClient = new AWS.SNS();
const ssmClient = new AWS.SSM();

const accountId = '649621042808';

snsClient.setSMSAttributes({
  attributes: {
    DefaultSMSType: 'Transactional',
  },
});

exports.lambdaHandler = async (event, context, callback) => {
  let method = 'twilio';

  try {
    const param = await ssmClient.getParameter({
      Name: 'CAMPAIGN_METHOD'
    }).promise();

    method = param.Parameter.Value;
  } catch (e) {}

  try {
    const updates = event.Records.map((record) => ({
      dateId: record.dynamodb.NewImage.DeliveryDate_DeliveryID.S,
      oldStatus: record.dynamodb.OldImage.DeliveryStatus.S,
      newStatus: record.dynamodb.NewImage.DeliveryStatus.S,
    }));

    const sharedCallbackUrl = event.Records[0].dynamodb.NewImage.callback.S;

    console.log(`Sending to callback ${sharedCallbackUrl} updates of ${JSON.stringify(updates.map(update => update.dateId))}`);
    await sendApiMessage({ updates }, sharedCallbackUrl);
    console.log(`Processing ${event.Records.length} records`);

    const records = event.Records.map((record) => {
      const row = record.dynamodb.NewImage;
      let from = 'HAAS'

      if (row.DeliveryFrom && row.DeliveryFrom.S) {
        from = row.DeliveryFrom.S;
      }

      const isModified = record.eventName === 'MODIFY';
      const hasDifferentStatus = record.dynamodb.NewImage.DeliveryStatus.S !== record.dynamodb.OldImage.DeliveryStatus.S;

      const willDeploy = row.DeliveryStatus.S === 'DEPLOYED';
      const hasRecipient = !!row.DeliveryRecipient.S;
      const hasBody = !!row.DeliveryBody.S;

      const willError = row.DeliveryStatus.S === 'ERRORED';

      if (isModified && hasDifferentStatus && willDeploy && hasRecipient && hasBody) {
          return deployMessage(
            row.DeliveryRecipient.S,
            row.DeliveryBody.S,
            from,
            method,
            row.DeliveryDate_DeliveryID.S,
            row.DeliveryType.S,
            'A delivery from HAAS!'
          )
      }

      if (isModified && willError) {
        console.error(`Error identified in ${row}`);
      }
    });

    console.log(`Deploying ${records.length} records`);
    await Promise.all(records);
    console.log(`Deployed ${records.length} records`);
  } catch (err) {
    console.log(err);
    callback(null, `Had an error: ${err}`);
  }
};

/**
 * Deploy message using EMAIL and SMS.
 */
const deployMessage = (recipient, body, from, method, deliveryId, deliveryType, subject) => {
  console.log('We should message the following entry:', JSON.stringify({ body, from, method, deliveryType }));

  if (deliveryType === 'EMAIL') {
    return sendRecordEmail(recipient, body, subject);

  } else if (deliveryType === 'SMS') {
    return sendSms(recipient, body, from, deliveryId, method);
  }
}

/**
 * Deploy SMS using Twilio or AWS.
 */
const sendSms = (recipient, body, from, deliveryId, method = 'twilio') => {
  switch(method) {
    case 'twilio': {
      return sendTwilioMessage(recipient, body, deliveryId, from);
    }

    case 'aws': {
      return sendRecordSMS(recipient, body, from);
    }

    default: {
      return sendTwilioMessage(recipient, body, deliveryId, from);
    }
  }
}

const sendRecordEmail = (
  recipient,
  body,
  subject,
  source = 'noreply@haas.live',
) => {
  return sesClient.sendEmail({
    Destination: {
      ToAddresses: [recipient],
    },
    Message: {
      Body: {
        Text: { Data: body },
      },

      Subject: { Data: subject },
    },
    Source: source,
  }).promise().catch((err) => {
    console.error('Error:', err);
  }).then(() => {
    console.log('Done!');
  });
};

const sendRecordSMS = (
  recipient,
  body,
  from = 'haas'
) => {
  return snsClient.publish({
    MessageAttributes: {
      'AWS.SNS.SMS.SenderID': {
        'DataType': 'String',
        'StringValue': from
      }
    },
    PhoneNumber: recipient,
    Message: body,
  }).promise().catch((err) => {
    console.error('Error:', err);
  }).then((data) => {
    console.log('Sent SMS!');
    console.log(data);
  });
};

const sendTwilioMessage = (
  recipient,
  body,
  deliveryId,
  from = 'haas'
) => {
  return snsClient.publish({
    TopicArn: `arn:aws:sns:eu-central-1:${accountId}:twilioSMSTopic`,
    Message: JSON.stringify({
      PhoneNumber: recipient,
      body,
      from,
      deliveryId
    })
  }).promise();
};

const sendApiMessage = (
  payload,
  callbackUrl,
) => {
  return snsClient.publish({
    TopicArn: `arn:aws:sns:eu-central-1:${accountId}:haasApiMessage`,
    Message: JSON.stringify({
      payload,
      callbackUrl
    })
  }).promise();
};
