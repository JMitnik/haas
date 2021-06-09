import { Share, ShareCreateInput, ShareUpdateInput, BatchPayload } from "@prisma/client";

export interface ShareNodePrismaAdapterType {
  delete(id: string): Promise<Share>;
  deleteManyByParentQuestionId(parentId: string): Promise<BatchPayload>;
  upsert(id: string, create: ShareCreateInput, update: ShareUpdateInput): Promise<Share>;
}