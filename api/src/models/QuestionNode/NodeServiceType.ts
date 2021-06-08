import { QuestionNode, Link } from "@prisma/client";
import { NexusGenInputs } from "../../generated/nexus";

export interface NodeServiceType {
  getNodeById(parentNodeId: string): Promise<QuestionNode|null>;
  createTemplateNodes(dialogueId: string, workspaceName: string, leafs: QuestionNode[]): Promise<void>;
  getNodeByLinkId(linkId: string): Promise<QuestionNode|null|undefined>;
  removeNonExistingLinks(existingLinks: Array<Link>, newLinks: NexusGenInputs['CTALinkInputObjectType'][]): Promise<void>
}