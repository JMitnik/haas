/* eslint-disable class-methods-use-this */
import AWS from '../../config/aws';

import config from '../../config/config';

export interface MailSendInput {
  recipient: string;
  body: string;
  subject: string;
  from?: string | null;
}

class MailService {
  send(input: MailSendInput) {
    // if (config.env === 'local') return;

    const mailDriver = new AWS.SES();

    const sendPromise = mailDriver.sendEmail({
      Destination: {
        ToAddresses: [
          input.recipient,
        ],
      },
      Message: {
        Subject: {
          Charset: 'UTF-8',
          Data: input.subject,
        },
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data: input.body,
          },
        },
      },
      Source: config.mailSender,
    }).promise();

    sendPromise.then((res) => {
      console.log('Res!:', res);
    }).catch((err) => {
      console.error('Error!:', err);
    });
  }
}

export const mailService = new MailService();

export default MailService;
