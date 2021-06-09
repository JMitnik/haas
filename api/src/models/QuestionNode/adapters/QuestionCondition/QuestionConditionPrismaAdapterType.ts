import { BatchPayload, QuestionConditionUpdateInput, QuestionCondition, QuestionConditionCreateInput } from "@prisma/client";

export interface QuestionConditionPrismaAdapterType {
  deleteManyByEdgeIds(edgeIds: string[]): Promise<BatchPayload>;
  update(id: number | undefined, data: QuestionConditionUpdateInput): Promise<QuestionCondition>;
  upsert(id: number, create: QuestionConditionCreateInput, update: QuestionConditionUpdateInput): Promise<QuestionCondition>;
}