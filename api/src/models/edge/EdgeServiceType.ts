import { QuestionCondition, Edge, QuestionNode } from "@prisma/client";

export interface EdgeServiceType {
  getConditionsById(edgeId: string): Promise<QuestionCondition[]>;
  getEdgeById(edgeId: string): Promise<(Edge & {
    conditions: QuestionCondition[];
  }) | null>;
  createEdge(parent: QuestionNode, child: QuestionNode, conditions: any): Promise<void>
}