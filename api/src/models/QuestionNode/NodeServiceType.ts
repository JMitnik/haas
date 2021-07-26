import { QuestionNode, Link, Share, NodeType, VideoEmbeddedNode, Dialogue, QuestionOption, Edge } from "@prisma/client";
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

export interface NodeServiceType {
  getEdgesOfQuestion(nodeId: string): Promise<Edge[]>;
  getOptionsByParentId(parentId: string): Promise<(QuestionOption & {
    overrideLeaf: QuestionNode | null;
  })[]>;
  getLinksByParentId(parentId: string): Promise<Link[]>;
  getShareNode(parentId: string): Promise<Share>;
  getVideoEmbeddedNode(nodeId: string): Promise<VideoEmbeddedNode | null>;
  getNodeById(parentNodeId: string): Promise<QuestionNode | null>;
  createTemplateNodes(dialogueId: string, workspaceName: string, leafs: QuestionNode[]): Promise<void>;
  getNodeByLinkId(linkId: string): Promise<QuestionNode | null | undefined>;
  removeNonExistingLinks(existingLinks: Array<Link>, newLinks: NexusGenInputs['CTALinkInputObjectType'][]): Promise<void>;
  createCTA(input: {
    dialogueSlug: string,
    customerSlug: string,
    title: string,
    type?: "GENERIC" | "SLIDER" | "FORM" | "CHOICE" | "REGISTRATION" | "TEXTBOX" | "LINK" | "SHARE" | "VIDEO_EMBEDDED" | undefined,
    form?: NexusGenInputs['FormNodeInputType'] | null, // FormNodeInputType
    links: {
      id: string | undefined;
      backgroundColor: string | undefined;
      iconUrl: string | undefined;
      title: string | undefined;
      type: "API" | "FACEBOOK" | "INSTAGRAM" | "LINKEDIN" | "SOCIAL" | "TWITTER" | "WHATSAPP";
      url: string;
    }[],
    share: {
      id: string | undefined;
      title: string;
      tooltip: string | undefined;
      url: string;
    } | undefined,
  }): Promise<QuestionNode>;
  updateCTA(input: NexusGenInputs['UpdateCTAInputType']): Promise<QuestionNode>;
  delete(id: string): Promise<QuestionNode>
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