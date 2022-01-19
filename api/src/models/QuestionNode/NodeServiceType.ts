import { Dialogue, LinkTypeEnum, NodeType, QuestionCondition } from "@prisma/client";
import { NexusGenInputs } from "../../generated/nexus";
import { QuestionConditionProps } from "../questionnaire/DialogueTypes";

export interface QuestionOptionProps {
  id?: number;
  value: string;
  publicValue?: string | null;
  overrideLeafId?: string;
  position: number | null;
}
export interface LinkGenericInputProps {
  type: LinkTypeEnum;
  url: string;
}

export interface EdgeChildProps {
  id?: string;
  conditions: [QuestionConditionProps];
  parentNode: EdgeNodeProps;
  childNode: EdgeNodeProps;
}

export interface EdgeNodeProps {
  id: string;
  title: string;
}

export interface LeafNodeDataEntryProps {
  title: string;
  type: NodeType;
  links: any[];
  form?: NexusGenInputs['FormNodeInputType'];
}

export interface CreateCTAInputProps {
  dialogueSlug: string,
  customerSlug: string,
  questionId?: string | null,
  title: string,
  type?: NodeType;
  form?: NexusGenInputs['FormNodeInputType'] | null, // FormNodeInputType
  links: {
    id: string | undefined;
    backgroundColor: string | undefined;
    iconUrl: string | undefined;
    title: string | undefined;
    type: LinkTypeEnum;
    url: string;
  }[],
  share: {
    id: string | undefined;
    title: string;
    tooltip: string | undefined;
    url: string;
  } | undefined,
}

export type DialogueWithEdges = Dialogue & {
  questions: {
    id: string;
  }[];
  edges: {
    id: string;
    parentNodeId: string;
    childNodeId: string;
  }[];
}
