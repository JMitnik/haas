import { ShareNodePrismaAdapterType } from "./ShareNodePrismaAdapterType";
import { PrismaClient, ShareCreateInput, ShareUpdateInput } from "@prisma/client";

class ShareNodePrismaAdapter implements ShareNodePrismaAdapterType {
  prisma: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
  }

  deleteManyByParentQuestionId(parentId: string): Promise<import("@prisma/client").BatchPayload> {
    return this.prisma.share.deleteMany({
      where: {
        questionNodeId: parentId,
      },
    });
  };

  upsert(id: string, create: ShareCreateInput, update: ShareUpdateInput): Promise<import("@prisma/client").Share> {
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
