import { TriggerCondition, BatchPayload } from "@prisma/client";

export interface TriggerConditionPrismaAdapterType {
  findManyByTriggerId(triggerId: string): Promise<TriggerCondition[]>;
  deleteManyByTriggerId(triggerId: string): Promise<BatchPayload>;
}