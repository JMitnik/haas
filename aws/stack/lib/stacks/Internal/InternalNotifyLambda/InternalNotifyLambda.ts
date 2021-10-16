import { SNSEvent, Context } from 'aws-lambda';
import * as AWS from 'aws-sdk';
import fetch from 'node-fetch';


exports.main = async function (event: SNSEvent, context: Context) {
  const snsMessage = event.Records?.[0].Sns.Message || '';


  const slackUrl = await getSlackUrl();
  if (!slackUrl) {
    throw new Error('No slack URL found!');
  }

  await sendToSlack(slackUrl, snsMessage);
}

const getSlackUrl = async () => {
  const slackSecret = await new AWS.SecretsManager().getSecretValue({ SecretId: 'internal/SLACK_URL' }).promise();
  const slackUrl = slackSecret.SecretString;
  return slackUrl;
}

const sendToSlack = async (slackUrl: string, message: string) => {
  await fetch(slackUrl, {
    body: JSON.stringify({ text: message }),
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    }
  });
};
