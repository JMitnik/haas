import { NexusGenFieldTypes } from "../../generated/nexus";

type GraphqlConsumer = NexusGenFieldTypes['ConsumerModel'];
type GraphqlSubscription = NexusGenFieldTypes['SubscriptionModel'];

export interface Consumer extends GraphqlConsumer {
  subscriptions: GraphqlSubscription[];
}
