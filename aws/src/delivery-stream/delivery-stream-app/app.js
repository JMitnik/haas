const AWS = require('aws-sdk');

const sesClient = new AWS.SES();
const snsClient = new AWS.SNS();
const sqsClient = new AWS.SQS();

exports.lambdaHandler = async (event, context, callback) => {
  try {
    await Promise.all(event.Records.map((record) => {
      const row = record.dynamodb.NewImage;
      
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
          return sendRecordSMS(
            row.DeliveryRecipient.S,
            row.DeliveryBody.S
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
) => {
  return snsClient.publish({
    PhoneNumber: recipient,
    Message: body,
  }).promise().catch((err) => {
    console.error('Error:', err);
  }).then(() => {
    console.log('Done!');
  });
};
