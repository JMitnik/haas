import { PrismaClient } from "@prisma/client";

import { SubscriptionPrismaAdapter } from "./SubscriptionPrismaAdapter";
import { Consumer } from "./SubscriptionTypes";

export class SubscriptionService {
  prisma: PrismaClient;
  prismaAdapter: SubscriptionPrismaAdapter;

  constructor(prismaClient: PrismaClient, prismaAdapter: SubscriptionPrismaAdapter) {
    this.prisma = prismaClient;
    this.prismaAdapter = prismaAdapter;
  }

  async getConsumer(consumerId: string) {
    const consumer = await this.prismaAdapter.fetchConsumer(consumerId);
    return consumer;
  }
  async createSubscriptionForConsumer(consumerId: string) {}
  async createSubscription() {}
  async getSubscription(subscriptionId: string) {}
  async disableSubscription(subscriptionId: string) {}
  async archiveSubscription(subscriptionId: string) {}
  async getSubscriptionDeliveries(subscriptionId: string) {}
  async getUpcomingSubscriptionDelivery(consumerId: string, subscriptionId: string) {

  }
}
