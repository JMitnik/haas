import client from 'twilio';

import config from '../../config/config';

export interface SMSServiceInputProps {
  twilioAccountSid: string;
  twilioAuthToken: string;
}

class SMSService {
  private twilioAccountSid: string;
  private twilioAuthToken: string;
  private twilio: client.Twilio | undefined;

  constructor(input: SMSServiceInputProps) {
    this.twilioAccountSid = input.twilioAccountSid;
    this.twilioAuthToken = input.twilioAuthToken;

    try {
      this.twilio = client(this.twilioAccountSid, this.twilioAuthToken);
    } catch (e) {
      console.log("Error in making Twilio client, wont make it now");
    }
  }

  sendSMS = (from: string, to: string, body: string, production: boolean = false) => {
    if (!production) {
      console.log('Fake send sms to: ', to);
      return;
    }
    
    this.twilio.messages
      .create({
        body,
        from,
        to: production ? to : '+31681401217',
      })
      .then((message) => console.log(message));
  };
}

export const smsService = new SMSService({
  twilioAccountSid: config.twilioAccountSid,
  twilioAuthToken: config.twilioAuthToken,
});

export default SMSService;
