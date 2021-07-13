import { ShareNodePrismaAdapterType } from "./ShareNodePrismaAdapterType";
import { BatchPayload, PrismaClient, Share, ShareCreateInput, ShareUpdateInput } from "@prisma/client";

class ShareNodePrismaAdapter implements ShareNodePrismaAdapterType {
  prisma: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
  }

  async getNodeByParentId(parentId: string) {
    return this.prisma.share.findFirst({
      where: {
        questionNodeId: parentId,
      },
    });
  }

  deleteManyByParentQuestionId(parentId: string): Promise<BatchPayload> {
    return this.prisma.share.deleteMany({
      where: {
        questionNodeId: parentId,
      },
    });
  };

  upsert(id: string, create: ShareCreateInput, update: ShareUpdateInput): Promise<Share> {
    return this.prisma.share.upsert({
      where: {
        id,
      },
      create,
      update,
    });
  };

  delete(id: string) {
    return this.prisma.share.delete({ where: { id } });
  }
}

export default ShareNodePrismaAdapter;
