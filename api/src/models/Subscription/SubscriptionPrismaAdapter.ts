import { Consumer, PrismaClient } from "@prisma/client";

export class SubscriptionPrismaAdapter {
  prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  /**
   * Fetch a consumer from prisma (with subscriptions).
   **/
  async fetchConsumer(consumerId: string) {
    return this.prisma.consumer.findFirst({
      where: { id: consumerId },
      include: { subscriptions: true }
    });
  }
}
