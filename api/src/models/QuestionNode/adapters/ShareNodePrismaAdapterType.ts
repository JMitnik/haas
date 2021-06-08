import { Share, ShareCreateInput, ShareUpdateInput } from "@prisma/client";

export interface ShareNodePrismaAdapterType {
  delete(id: string): Promise<Share>;
  upsert(id: string, create: ShareCreateInput, update: ShareUpdateInput): Promise<Share>;
}