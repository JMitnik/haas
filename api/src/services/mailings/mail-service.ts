import Mail from 'nodemailer/lib/mailer';
import nodemailer from 'nodemailer';

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
  container: any;
  transport: Mail;
  defaultSender: string;

  constructor(input: MailServiceInputProps) {
    this.transport = nodemailer.createTransport({
      host: input.host,
      port: input.port,
      auth: {
        user: input.user,
        pass: input.pass,
      },
    });

    this.defaultSender = input.defaultSender;
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
