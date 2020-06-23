import client from 'twilio';

const twilioAccountSid = 'AC820ded78b44349f074996d94aca241ef';
const authToken = '3cf6353e8400b2a08a2029e1fe93ebc3';

export interface SMSServiceInputProps {
  container: any;
  twilioAccountSid: string;
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

  twilioAccountSid: string;

  authToken: string;

  twilio: client.Twilio;

  constructor(input: SMSServiceInputProps) {
    this.container = input.container;
    this.twilioAccountSid = input.twilioAccountSid;
    this.authToken = input.authToken;
    this.twilio = client(twilioAccountSid, authToken);
  }

  sendSMS = (from: string, to: string, body: string, production: boolean = false) => {
    this.twilio.messages
      .create({
        body,
        from,
        to: production ? to : '+31681401217',
      })
      .then((message) => console.log(message));
  };
}

export default SMSService;
