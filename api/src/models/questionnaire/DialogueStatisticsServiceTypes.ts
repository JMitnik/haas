import { Edge, QuestionCondition, QuestionNode, Session, NodeEntry, ChoiceNodeEntry, SliderNodeEntry } from "@prisma/client";

interface EdgeWithCondition extends Edge {
  conditions: QuestionCondition[];
}

export interface NodeWithEdge extends QuestionNode {
  isParentNodeOf: EdgeWithCondition[];
}

export type SessionGroup = (Session & {
  rootValue: number;
  nodeEntries: (NodeEntry & {
      sliderNodeEntry: SliderNodeEntry | null;
      relatedNode: {
        isRoot: boolean;
      } | null;
  })[];
})[];

export type SessionChoiceGroupValue = {
  value: string;
  count: number;
  sumScore: number;
  maxScore: number;
  minScore: number;
}
