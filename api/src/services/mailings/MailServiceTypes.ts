export interface MailSendInput {
  recipient: string;
  body: string;
  subject: string;
  from?: string | null;
  noConsole?: boolean;
}

export interface MailServiceType {
  send(input: MailSendInput): void;
}