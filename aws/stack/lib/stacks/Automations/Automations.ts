import {
  App,
  aws_secretsmanager as secretsmanager, Stack,
} from 'aws-cdk-lib'
import { DialogueLinkSenderService } from './DialogueLinkSender/DialogueLinkSenderService';
import { ReportCrawlerService } from './ReportCrawler/ReportCrawlerService';

export class Automations extends Stack {
  constructor(scope: App, id: string) {
    super(scope, id);

    const jwtSecret = secretsmanager.Secret.fromSecretNameV2(this,
      'AUTOMATION_API_KEY',
      'SecretOfAutomation',
    );

    new ReportCrawlerService(this, 'ReportCrawlerService', {});

    new DialogueLinkSenderService(this, 'DialogueLinkSender', {
      // TODO: No-go
      AUTOMATION_API_KEY: jwtSecret.secretValueFromJson('AUTOMATION_API_KEY').toString()
    });
  }
}
