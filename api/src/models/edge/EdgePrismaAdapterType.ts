import { BatchPayload, QuestionCondition, Edge, EdgeCreateInput } from "@prisma/client";

export interface EdgePrismaAdapterType {
  deleteMany(edgeIds: string[]): Promise<BatchPayload>;
  getConditionsById(edgeId: string): Promise<QuestionCondition[]>;
  getEdgeById(edgeId: string): Promise<(Edge & {
    conditions: QuestionCondition[];
  }) | null>
  create(data: EdgeCreateInput): Promise<Edge>;
  findManyByParentId(parentId: string): Promise<Edge[]>;
}