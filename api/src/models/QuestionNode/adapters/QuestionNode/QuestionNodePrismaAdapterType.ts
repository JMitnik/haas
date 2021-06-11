import { BatchPayload, QuestionNode, QuestionNodeUpdateInput, FormNode, FormNodeField, Link, Share, QuestionNodeCreateInput, VideoEmbeddedNode, Edge, QuestionOption } from "@prisma/client";

export interface QuestionNodePrismaAdapterType {
  delete(id: string): Promise<QuestionNode>;
  create(data: QuestionNodeCreateInput): Promise<QuestionNode>;
  deleteMany(questionIds: string[]): Promise<BatchPayload>;
  getNodeById(nodeId: string): Promise<QuestionNode | null>;
  update(nodeId: string, data: QuestionNodeUpdateInput): Promise<QuestionNode>;
  getNodeByLinkId(linkId: string): Promise<QuestionNode | null | undefined>;
  getCTANode(nodeId: string): Promise<(QuestionNode & {
    form: (FormNode & {
      fields: FormNodeField[];
    }) | null;
    links: Link[];
    share: Share | null;
  }) | null>;
  getDialogueBuilderNode(nodeId: string): Promise<(QuestionNode & {
    videoEmbeddedNode: VideoEmbeddedNode | null;
    children: Edge[];
    options: QuestionOption[];
    questionDialogue: {
      id: string;
    } | null;
    overrideLeaf: {
      id: string;
    } | null;
  }) | null>
  updateDialogueBuilderNode(nodeId: string, data: QuestionNodeUpdateInput): Promise<(QuestionNode & {
    videoEmbeddedNode: VideoEmbeddedNode | null;
  }) | null>;
}