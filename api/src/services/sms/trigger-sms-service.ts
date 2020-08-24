import { Trigger, TriggerCondition, User } from '@prisma/client';
import SMSService from './sms-service';

class TriggerSMSService extends SMSService {
  sendTriggerSMS = (trigger: Trigger & {
    recipients: User[];
    conditions: TriggerCondition[];
    relatedNode: {
      questionDialogue: {
        title: string;
      } | null;
    } | null;
  }, recipientPhone: string, value: string | number) => {
    const twilioPhoneNumber = '+3197010253133';
    const smsBody = `Dear recipient, ${trigger.name} of ${trigger.relatedNode?.questionDialogue?.title} has been triggered with value: '${value}'. `;
    this.sendSMS(twilioPhoneNumber, recipientPhone, smsBody, true);
  };
}

export default TriggerSMSService;
