import { QuestionNode, Link, FormNode, FormNodeField, Share, NodeType, VideoEmbeddedNode, Dialogue } from "@prisma/client";
import { NexusGenInputs } from "../../generated/nexus";
import { QuestionConditionProps } from "../questionnaire/DialogueTypes";

export interface QuestionOptionProps {
  id?: number;
  value: string;
  publicValue?: string;
  overrideLeafId?: string;
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
  links: LinkGenericInputProps[];
  form?: NexusGenInputs['FormNodeInputType'];
}

export interface NodeServiceType {
  getNodeById(parentNodeId: string): Promise<QuestionNode | null>;
  createTemplateNodes(dialogueId: string, workspaceName: string, leafs: QuestionNode[]): Promise<void>;
  getNodeByLinkId(linkId: string): Promise<QuestionNode | null | undefined>;
  removeNonExistingLinks(existingLinks: Array<Link>, newLinks: NexusGenInputs['CTALinkInputObjectType'][]): Promise<void>;
  updateCTA(input: NexusGenInputs['UpdateCTAInputType']): Promise<QuestionNode>;
  createQuestionNode: (title: string, questionnaireId: string, type: NodeType, options?: Array<any>, isRoot?: boolean, overrideLeafId?: string, isLeaf?: boolean) => Promise<QuestionNode>;
  updateQuestionFromBuilder: (
    questionId: string,
    title: string,
    type: NodeType,
    overrideLeafId: string | null,
    edgeId: string | undefined,
    options: QuestionOptionProps[],
    edgeCondition: {
      id: number | null;
      conditionType: string;
      renderMin: number | null;
      renderMax: number | null;
      matchValue: string | null;
    },
    sliderNode: NexusGenInputs['SliderNodeInputType'],
    extraContent: string | null | undefined) => Promise<QuestionNode & {
      videoEmbeddedNode: VideoEmbeddedNode | null;
    } | null>;
  createTemplateLeafNodes: (leafNodesArray: LeafNodeDataEntryProps[], dialogueId: string) => Promise<QuestionNode[]>;
  deleteQuestionFromBuilder: (id: string, dialogue: Dialogue & {
    questions: {
      id: string;
    }[];
    edges: {
      id: string;
      parentNodeId: string;
      childNodeId: string;
    }[];
  }) => Promise<{
    id: string;
  } | undefined>;
  createQuestionFromBuilder: (dialogueId: string, title: string, type: NodeType, overrideLeafId: string, parentQuestionId: string, options: Array<QuestionOptionProps>, edgeCondition: {
    id: number | null;
    conditionType: string;
    renderMin: number | null;
    renderMax: number | null;
    matchValue: string | null;
  }, extraContent: string | null) => Promise<QuestionNode>;
}