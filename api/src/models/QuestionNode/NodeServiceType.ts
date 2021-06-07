import { QuestionNode } from "@prisma/client";

export interface NodeServiceType {
  getNodeById(parentNodeId: string): Promise<QuestionNode|null>;
  createTemplateNodes(dialogueId: string, workspaceName: string, leafs: QuestionNode[]): Promise<void>;
  getNodeByLinkId(linkId: string): Promise<QuestionNode|null|undefined>;
}