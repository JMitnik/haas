import { BatchPayload, QuestionNode, QuestionNodeUpdateInput, FormNode, FormNodeField, Link, Share } from "@prisma/client";

export interface QuestionNodePrismaAdapterType {
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
}