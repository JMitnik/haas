import { objectType } from "@nexus/schema";

import { ConsumerModel } from "./ConsumerModel";


/**
 * A subscription defines the relationship between a consumer and delivery-contexts (like Campaigns, Alerts, etc).
 **/
export const SubscriptionModel = objectType({
  name: 'SubscriptionModel',
  description: 'A subscription defines the relationship between consumer and delivery-contexts (like Campaigns).',

  definition(t) {
    t.id('id');
    t.field('consumer', { type: ConsumerModel, nullable: true });
  }
})
