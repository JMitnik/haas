import { QuestionNode, Link, FormNode, FormNodeField, Share, NodeType, VideoEmbeddedNode } from "@prisma/client";
import { NexusGenInputs } from "../../generated/nexus";

export interface QuestionOptionProps {
  id?: number;
  value: string;
  publicValue?: string;
  overrideLeafId?: string;
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
    } | null>
}