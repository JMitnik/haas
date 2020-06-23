import { ConfigProps } from '../config';
import MailService from './mailings/mail-service';
import SMSService from './sms/sms-service';
import TriggerMailService from './mailings/trigger-mail-service';

export interface ServiceContainerProps {
  mailService: MailService;
  triggerMailService: TriggerMailService;
  smsService: SMSService;
}

class ServiceContainer implements ServiceContainerProps {
  mailService: MailService;

  triggerMailService: TriggerMailService;

  smsService: SMSService;

  constructor(config: ConfigProps) {
    this.mailService = new MailService({
      container: this,
      host: config.mailServer,
      pass: config.mailPassword,
      port: config.mailPort,
      user: config.mailUsername,
      defaultSender: config.mailDefaultSender,
    });

    this.triggerMailService = new TriggerMailService({
      container: this,
      host: config.mailServer,
      pass: config.mailPassword,
      port: config.mailPort,
      user: config.mailUsername,
      defaultSender: config.mailDefaultSender,
    });

    this.smsService = new SMSService({
      container: this,
      twilioAccountSid: config.twilioAccountSid,
      authToken: config.authToken,
    });
  }
}

export default ServiceContainer;
