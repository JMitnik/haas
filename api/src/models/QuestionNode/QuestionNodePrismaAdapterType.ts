import { BatchPayload, QuestionNode, QuestionNodeUpdateInput } from "@prisma/client";

export interface QuestionNodePrismaAdapterType {
  deleteMany(questionIds: string[]): Promise<BatchPayload>;
  getNodeById(nodeId: string): Promise<QuestionNode|null>;
  update(nodeId: string, data: QuestionNodeUpdateInput): Promise<QuestionNode>;
}