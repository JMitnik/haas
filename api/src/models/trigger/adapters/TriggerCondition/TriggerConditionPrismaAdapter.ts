import { BatchPayload, PrismaClient, TriggerCondition } from "@prisma/client";

class TriggerConditionPrismaAdapter {
  prisma: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
  }

  async deleteById(conditionId: number) {
    const deletedCondition = await this.prisma.triggerCondition.delete({ where: { id: conditionId } });
    return deletedCondition.id;
  }

  deleteManyByTriggerId(triggerId: string): Promise<BatchPayload> {
    return this.prisma.triggerCondition.deleteMany({ where: { triggerId: triggerId } });
  }

  getConditionsByTriggerId(triggerId: string): Promise<TriggerCondition[]> {
    return this.prisma.triggerCondition.findMany({ where: { triggerId: triggerId }, orderBy: { createdAt: 'asc' } });
  };
};

export default TriggerConditionPrismaAdapter;
