import MailService from './mailings/mail-service';
import TriggerMailService from './mailings/trigger-mail-service';
import { ConfigProps } from '../config';

export interface ServiceContainerProps {
  mailService: MailService;
  triggerMailService: TriggerMailService;
}

class ServiceContainer implements ServiceContainerProps {
  mailService: MailService;

  triggerMailService: TriggerMailService;

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
  }
}

export default ServiceContainer;
