export interface MailSendInput {
  recipient: string;
  body: string;
  subject: string;
  from?: string | null;
}

export interface MailServiceType {
  send(input: MailSendInput): void;
}