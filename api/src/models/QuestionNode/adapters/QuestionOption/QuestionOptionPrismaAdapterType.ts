import { BatchPayload, QuestionOptionCreateInput, QuestionOptionUpdateInput, QuestionOption, QuestionNode } from "@prisma/client";

export interface QuestionOptionPrismaAdapterType {
  deleteManyByQuestionIds(questionIds: string[]): Promise<BatchPayload>;
  upsert(id: number, create: QuestionOptionCreateInput, update: QuestionOptionUpdateInput): Promise<QuestionOption>;
  deleteMany(optionIds: number[]): Promise<BatchPayload>;
  findOptionsByParentId(parentId: string): Promise<(QuestionOption & { overrideLeaf: QuestionNode | null })[]>;
}