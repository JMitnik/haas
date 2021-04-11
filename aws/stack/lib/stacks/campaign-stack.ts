import * as cdk from '@aws-cdk/core';
import { TwilioHandlerService } from '../lambdas/twilio-handler/twilio-handler-service';

interface HaasCampaignStackProps {
  accountId: string;
}

export class HaasCampaignStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: HaasCampaignStackProps) {
    super(scope, id);

    const twilioHandler = new TwilioHandlerService(this, 'TwilioHandler', {
      accountId: props.accountId
    });
  }
}
