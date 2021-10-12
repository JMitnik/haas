import * as cdk from '@aws-cdk/core';
import { TwilioHandlerService } from '../lambdas/twilio-handler/twilio-handler-service';
import { HaasAPIHandleService } from '../lambdas/haas-api-handler/haas-api-handle-service';
import { DeliverySchedulerConstruct } from './DeliveryScheduler/DeliverySchedulerConstruct';

interface HaasCampaignStackProps {
  accountId: string;
}

export class HaasCampaignStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: HaasCampaignStackProps) {
    super(scope, id);

    new HaasAPIHandleService(this, 'HAASApiHandler');

    new DeliverySchedulerConstruct(this, 'DeliveryScheduler');

    new TwilioHandlerService(this, 'TwilioHandler', {
      accountId: props.accountId
    });
  }
}
