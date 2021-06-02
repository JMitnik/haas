import { BatchPayload } from "@prisma/client";

export interface QuestionNodePrismaAdapterType {
  deleteMany(questionIds: string[]): Promise<BatchPayload>;
}