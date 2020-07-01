import { Trigger } from '@prisma/client';
import SMSService from './sms-service';

class TriggerSMSService extends SMSService {
  sendTriggerSMS = (trigger: Trigger, recipientPhone: string, value: string | number) => {
    const twilioPhoneNumber = '+3197010252775';
    const smsBody = `'${trigger.name}' - value: '${value}'.`;
    this.sendSMS(twilioPhoneNumber, recipientPhone, smsBody, true);
  };
}

export default TriggerSMSService;
