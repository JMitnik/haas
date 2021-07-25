import { objectType } from "@nexus/schema";

import { SubscriptionModel } from "./SubscriptionModel";


/**
 * A consumer defines a user as a single entity who can be tracked in the dialogue.
 **/
export const ConsumerModel = objectType({
  name: 'ConsumerModel',
  description: 'A consumer defines a user as a single entity who can be tracked in the dialogue.',

  definition(t) {
    t.id('id');
    t.boolean('isDisabled');

    t.list.field('subscriptions', {
      type: SubscriptionModel,
      resolve: async (parent, args, ctx) => {
        const parentConsumer = await ctx.services.subscriptionService.getConsumer(parent.id);

        return parentConsumer.subscriptions || [];
      }
    });
  }
})
