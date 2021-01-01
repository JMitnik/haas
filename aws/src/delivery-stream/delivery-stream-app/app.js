const AWS = require('aws-sdk');
const twilio = require('twilio');

const sesClient = new AWS.SES();
let twilioClient;

exports.lambdaHandler = async (event, context, callback) => {
  const { TWILIO_ACCOUNT_SID, TWILIO_ACCOUNT_AUTH } = await getTwilioSecret();

  twilioClient = twilio(TWILIO_ACCOUNT_SID, TWILIO_ACCOUNT_AUTH);

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

const sendRecordEmail = async (
  recipient,
  body,
  subject,
  source = 'noreply@haas.live',
) => {
  try {
    await sesClient.sendEmail({
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
    }).promise();
  } catch (err) {
    console.error('Error:', err);
  }
  console.log('Done!');
};

const sendRecordSMS = async (
  recipient,
  body,
) => {
  try {

  
  await twilioClient.messages.create({
    body,
    to: recipient,
    // TODO: Put this in a secret manager or something
    from: '+15027915271'
  });
    await snsClient.publish({
      PhoneNumber: recipient,
      Message: body,
    }).promise();
  } catch (err) {
    console.error('Error:', err);
  }
  console.log('Done!');
};


const getTwilioSecret = async () => {
  let secret;
  
  await secretClient.getSecretValue({SecretId: secretName}, function(err, data) {
      if (err) {
          if (err.code === 'DecryptionFailureException')
              // Secrets Manager can't decrypt the protected secret text using the provided KMS key.
              // Deal with the exception here, and/or rethrow at your discretion.
              throw err;
          else if (err.code === 'InternalServiceErrorException')
              // An error occurred on the server side.
              // Deal with the exception here, and/or rethrow at your discretion.
              throw err;
          else if (err.code === 'InvalidParameterException')
              // You provided an invalid value for a parameter.
              // Deal with the exception here, and/or rethrow at your discretion.
              throw err;
          else if (err.code === 'InvalidRequestException')
              // You provided a parameter value that is not valid for the current state of the resource.
              // Deal with the exception here, and/or rethrow at your discretion.
              throw err;
          else if (err.code === 'ResourceNotFoundException')
              // We can't find the resource that you asked for.
              // Deal with the exception here, and/or rethrow at your discretion.
              throw err;
      }
      else {
          // Decrypts secret using the associated KMS CMK.
          // Depending on whether the secret is a string or binary, one of these fields will be populated.
          if ('SecretString' in data) {
              secret = data.SecretString;
          } else {
              let buff = new Buffer(data.SecretBinary, 'base64');
              decodedBinarySecret = buff.toString('ascii');
          }
      }
  }).promise();
  
  return JSON.parse(secret);
}