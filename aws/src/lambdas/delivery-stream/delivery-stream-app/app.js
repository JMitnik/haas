const AWS = require('aws-sdk');
const https = require('https');
const URL = require('url');

const sesClient = new AWS.SES();
const snsClient = new AWS.SNS();
const sqsClient = new AWS.SQS();

const accountId = '649621042808';

snsClient.setSMSAttributes({
  attributes: {
    DefaultSMSType: 'Transactional',
  },
});

exports.lambdaHandler = async (event, context, callback) => {
  console.log(JSON.stringify(event, null, 4));

  try {
    const updates = event.Records.map((record) => ({
      dateId: record.dynamodb.NewImage.DeliveryDate_DeliveryID.S,
      oldStatus: record.dynamodb.OldImage.DeliveryStatus.S,
      newStatus: record.dynamodb.NewImage.DeliveryStatus.S,
    }));

    const sharedCallbackUrl = event.Records[0].dynamodb.NewImage.callback.S;

    try {
      await sendToCallbackUrl(sharedCallbackUrl, updates);
    } catch(error) {
      console.error(`Unable to send update to callback url at ${sharedCallbackUrl}. Will still send SMS`);
    }

    await Promise.all(event.Records.map((record) => {
      const row = record.dynamodb.NewImage;
      let from = 'HAAS'

      if (row.DeliveryFrom && row.DeliveryFrom.S) {
        from = row.DeliveryFrom.S;
      }

      if (
        record.eventName === 'MODIFY'
          && record.dynamodb.NewImage.DeliveryStatus.S !== record.dynamodb.OldImage.DeliveryStatus.S
          && row.DeliveryStatus.S === 'DEPLOYED'
          && row.DeliveryRecipient.S
          && row.DeliveryBody.S
      ) {
        console.log('We should message the following entry:', JSON.stringify(record.dynamodb.NewImage));

        if (row.DeliveryType.S === 'EMAIL') {
          return sendRecordEmail(
            row.DeliveryRecipient.S,
            row.DeliveryBody.S,
            'A delivery from HAAS!'
          );

        } else if (row.DeliveryType.S === 'SMS') {
          // return sendTwilioMessage(
          //   row.DeliveryRecipient.S,
          //   row.DeliveryBody.S,
          //   row.DeliveryDate_DeliveryID.S
          // );
          return sendRecordSMS(
            row.DeliveryRecipient.S,
            row.DeliveryBody.S,
            from
          );
        }
      }
    }));
  } catch (err) {
    console.log(err);
    callback(null, `Had an error: ${err}`);
  }
};

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
  }).promise().catch((err) => {
    console.error('Error:', err);
  }).then((data) => {
    console.log('Sent SMS!');
    console.log(data);
  });
};

const sendToCallbackUrl = async (callbackUrl, payload) => {
  const {hostname, pathname} = URL.parse(callbackUrl);

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
          reject(e.message);
        });

        // send the request
        req.write(JSON.stringify(payload));
        req.end();
    });
};
