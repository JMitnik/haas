import client from 'twilio';

const accountSid = 'AC820ded78b44349f074996d94aca241ef';
const authToken = '3cf6353e8400b2a08a2029e1fe93ebc3';

export interface SMSServiceInputProps {
  container: any;
  accountSid: string;
  authToken: string;
}

export interface MailSendOptionsProps {
  to: string;
  body: string | any;
  subject: string;
  from?: string | null;
}

class SMSService {
  container: any;

  accountSid: string;

  authToken: string;

  twilio: client.Twilio;

  constructor(input: SMSServiceInputProps) {
    this.container = input.container;
    this.accountSid = input.accountSid;
    this.authToken = input.authToken;
    this.twilio = client(accountSid, authToken);
    console.log('initialized twilio: ', this.twilio);
  }

  sendSMS = (from: string, to: string, body: string) => {
    this.twilio.messages
      .create({
        body: 'HAAS SMS TEST - Made by your favorite Daan ',
        from: '+3197010252775',
        to: '+31681401217',
      })
      .then((message) => console.log(message));
  };
}

export default SMSService;
