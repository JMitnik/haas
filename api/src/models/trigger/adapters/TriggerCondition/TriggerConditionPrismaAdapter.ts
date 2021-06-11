import { TriggerConditionPrismaAdapterType } from "./TriggerConditionPrismaAdapterType";
import { PrismaClient } from "@prisma/client";

class TriggerConditionPrismaAdapter implements TriggerConditionPrismaAdapterType {
  prisma: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
  }
  deleteManyByTriggerId(triggerId: string): Promise<import("@prisma/client").BatchPayload> {
    return this.prisma.triggerCondition.deleteMany({ where: { triggerId: triggerId } });;
  }

  findManyByTriggerId(triggerId: string): Promise<import("@prisma/client").TriggerCondition[]> {
    return this.prisma.triggerCondition.findMany({ where: { triggerId: triggerId }, orderBy: { createdAt: 'asc' } });
  };
};

export default TriggerConditionPrismaAdapter;
