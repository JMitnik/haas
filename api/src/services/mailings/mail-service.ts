import Mail from 'nodemailer/lib/mailer';
import nodemailer from 'nodemailer';

import AWS from '../../config/aws';

import config from '../../config/config';

export interface MailServiceInputProps {
  host: string;
  port: number;
  user: string;
  pass: string;
  defaultSender: string;
}

export interface MailSendOptionsProps {
  to: string;
  body: string | any;
  subject: string;
  from?: string | null;
}

class MailService {
  constructor(input: MailServiceInputProps) {
    // AWS.SNS
  }

  sendMail({ from, to, subject, body }: MailSendOptionsProps) {
    if (!to) {
      throw new Error('No receiver given');
    }

    console.log('Mail is sent!');
  }
}

export const mailService = new MailService({
  host: config.mailServer,
  pass: config.mailPassword,
  port: config.mailPort,
  user: config.mailUsername,
  defaultSender: config.mailDefaultSender,
});

export default MailService;
