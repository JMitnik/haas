import { BatchPayload } from "@prisma/client";

export interface QuestionOptionPrismaAdapterType {
  deleteManyByQuestionIds(questionIds: string[]): Promise<BatchPayload>;
}