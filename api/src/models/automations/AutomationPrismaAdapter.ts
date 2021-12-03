import { DeliveryStatusTypeEnum, Prisma, PrismaClient } from '@prisma/client';

export class AutomationPrismaAdapter {
  prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

}
