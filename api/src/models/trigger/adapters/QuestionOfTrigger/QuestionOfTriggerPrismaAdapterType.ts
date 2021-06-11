import { QuestionNode, Dialogue, BatchPayload, QuestionOfTriggerCreateInput, QuestionOfTrigger } from "@prisma/client";

export interface QuestionOfTriggerPrismaAdapterType {
  findOneQuestion(triggerId: string, triggerConditionId: number): Promise<QuestionNode|null>;
  findDialogueByTriggerId(triggerId: string): Promise<Dialogue|null>;
  deleteManyByTriggerId(triggerId: string): Promise<BatchPayload>;
  create(data: QuestionOfTriggerCreateInput): Promise<QuestionOfTrigger>;
}