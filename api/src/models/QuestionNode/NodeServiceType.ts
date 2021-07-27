import { QuestionNode, Link, Share, NodeType, VideoEmbeddedNode, Dialogue, QuestionOption, Edge, LinkTypeEnum } from "@prisma/client";
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
  type: 'SOCIAL' | 'API' | 'FACEBOOK' | 'LINKEDIN' | 'WHATSAPP' | 'INSTAGRAM' | 'TWITTER';
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