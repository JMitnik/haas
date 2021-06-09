import { BatchPayload, QuestionConditionUpdateInput, QuestionCondition } from "@prisma/client";

export interface QuestionConditionPrismaAdapterType {
  deleteManyByEdgeIds(edgeIds: string[]): Promise<BatchPayload>;
  update(id: number | undefined, data: QuestionConditionUpdateInput): Promise<QuestionCondition>;
}