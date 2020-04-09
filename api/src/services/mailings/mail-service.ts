import nodemailer from 'nodemailer';

import Mail from 'nodemailer/lib/mailer';

export interface MailServiceInputProps {
  container: any;
  host: string;
  port: number;
  user: string;
  pass: string;
  defaultSender: string;
}

export interface MailSendOptionsProps {
  to: string;
  body: string;
  subject: string;
  from?: string | null;
}

class MailService {
  container: any;

  transport: Mail;

  defaultSender: string;

  constructor(input: MailServiceInputProps) {
    this.container = input.container;

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

    this.transport.sendMail({
      from: from || this.defaultSender,
      to,
      subject,
      html: body,
    }, (error) => {
      if (error) {
        console.log('error: ', error);
      }
    });

    console.log('Mail is sent!');
  }
}

export default MailService;
