import { BatchPayload } from "@prisma/client";

export interface QuestionConditionPrismaAdapterType {
  deleteManyByEdgeIds(edgeIds: string[]): Promise<BatchPayload>;
}