import * as cdk from '@aws-cdk/core';
import { TwilioHandlerService } from '../lambdas/twilio-handler/twilio-handler-service';
import * as lambda from '@aws-cdk/aws-lambda-nodejs';
import { HaasAPIHandleService } from '../lambdas/haas-api-handler/haas-api-handle-service';

interface HaasCampaignStackProps {
  accountId: string;
}

export class HaasCampaignStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: HaasCampaignStackProps) {
    super(scope, id);

    const haasApiHandler = new HaasAPIHandleService(this, 'HAASApiHandler');

    const twilioHandler = new TwilioHandlerService(this, 'TwilioHandler', {
      accountId: props.accountId
    });
  }
}
