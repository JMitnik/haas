import * as cdk from '@aws-cdk/core';
import { TwilioHandlerService } from './twilio-handler-service';

export class HaasCampaignStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string) {
    super(scope, id);

    const twilioHandler = new TwilioHandlerService(this, 'TwilioHandler');
  }
}
