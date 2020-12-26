const AWS = require('aws-sdk');

const sesClient = new AWS.SES();
const snsClient = new AWS.SNS();

exports.lambdaHandler = async (event, context, callback) => {
  try {
    console.log('Okay I spotted a new entry!');
    event.Records.forEach((record) => {
      console.log('Considering record: ', record.dynamodb.NewImage.DeliveryBody.S);
      if (
        record.eventName === 'MODIFY'
          && record.dynamodb.NewImage.DeliveryStatus.S !== record.dynamodb.OldImage.DeliveryStatus.S
          && record.dynamodb.NewImage.DeliveryStatus.S === 'DEPLOYED'
          && record.dynamodb.NewImage.DeliveryRecipient.S
          && record.dynamodb.NewImage.DeliveryBody.S
      ) {
        console.log('We should mail the following entry:', JSON.stringify(record.dynamodb.NewImage));

        sesClient.sendEmail({
          Destination: {
            ToAddresses: [record.dynamodb.NewImage.DeliveryRecipient.S],
          },
          Message: {
            Body: {
              Text: { Data: record.dynamodb.NewImage.DeliveryBody.S },
            },

            Subject: { Data: 'Surprise delivery from HAAS!' },
          },
          Source: 'noreply@haas.live',
        }, (err, data) => {
          if (err) {
            console.error('Unable to send message. Error JSON:', JSON.stringify(err, null, 2));
          } else {
            console.log('Results from sending message: ', JSON.stringify(data, null, 2));
          }
        }).promise().catch((err) => {
          console.error('Error:', err);
        }).then(() => {
          console.log('Done!');
        });
      }
    });
  } catch (err) {
    console.log(err);
    callback(null, `Had an error: ${err}`);
  }
};
