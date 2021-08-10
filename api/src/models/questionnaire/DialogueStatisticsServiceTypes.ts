import { Edge, QuestionCondition, QuestionNode, Session, NodeEntry, ChoiceNodeEntry, SliderNodeEntry } from "@prisma/client";

interface EdgeWithCondition extends Edge {
  conditions: QuestionCondition[];
}

export interface NodeWithEdge extends QuestionNode {
  isParentNodeOf: EdgeWithCondition[];
}

export type SessionGroup = (Session & {
  nodeEntries: (NodeEntry & {
      choiceNodeEntry: ChoiceNodeEntry | null;
      sliderNodeEntry: SliderNodeEntry | null;
      relatedNode: {
        isRoot: boolean;
      } | null;
  })[];
})[];
