import { Edge, QuestionCondition, QuestionNode } from "@prisma/client";

interface EdgeWithCondition extends Edge {
  conditions: QuestionCondition[];
}

export interface NodeWithEdge extends QuestionNode {
  isParentNodeOf: EdgeWithCondition[];
}
