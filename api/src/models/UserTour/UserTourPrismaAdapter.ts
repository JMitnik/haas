import { PrismaClient } from '@prisma/client';

export class UserTourPrismaAdapter {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

}
