import * as cdk from '@aws-cdk/core';
import { TwilioHandlerService } from './twilio-handler-service';
import { DeliveryJobService } from './delivery-job-service';

export class CampaignService extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string) {
    super(scope, id);

    const deliveryJobService = new DeliveryJobService(this, 'DeliveryJobService');
    const twilioHandler = new TwilioHandlerService(this, 'TwilioHandler');
  }
}
