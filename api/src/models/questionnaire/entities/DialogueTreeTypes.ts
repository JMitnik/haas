import { Prisma } from "@prisma/client";

import { NexusGenFieldTypes } from "../../../generated/nexus";

export type GraphqlEdge = NexusGenFieldTypes['Edge'];

// Prisma types
const questionNode = Prisma.validator<Prisma.QuestionNodeArgs>()({
  include: { isParentNodeOf: true }
});
const edge = Prisma.validator<Prisma.EdgeArgs>()({
  include: { conditions: true }
});
export type PrismaQuestionNode = Prisma.QuestionNodeGetPayload<typeof questionNode>;
export type PrismaEdge = Prisma.EdgeGetPayload<typeof edge>;

// Entity-related tpye
export interface DialogueTreeEdge extends Omit<PrismaEdge, 'childNode'> {
  childNode?: DialogueTreeNode;
};
export interface DialogueTreeNode extends Omit<PrismaQuestionNode, 'isParentNodeOf'> {
  layer: number;
  isParentNodeOf: DialogueTreeEdge[];
}

export interface DialogueBranchSplit {
  positiveBranch: DialogueTreeBranch;
  negativeBranch: DialogueTreeBranch;
}

export interface DialogueTreeBranch {
  upperLimit?: number;
  lowerLimit?: number;
  rootEdge?: DialogueTreeEdge;
}
