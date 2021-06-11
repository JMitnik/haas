import { PrismaClient } from "@prisma/client";
import { TriggerPrismaAdapterType } from "./TriggerPrismaAdapterType";

class TriggerPrismaAdapter implements TriggerPrismaAdapterType {
  prisma: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
  }
}

export default TriggerPrismaAdapter;
