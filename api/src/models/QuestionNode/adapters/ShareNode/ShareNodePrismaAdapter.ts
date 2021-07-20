import { BatchPayload, PrismaClient, Share, ShareCreateInput, ShareUpdateInput } from "@prisma/client";

export type UpdateShareInput = {
  title: string;
  url: string;
  tooltip: string;
}

export interface CreateShareInput extends UpdateShareInput {
  questionId: string;
};

class ShareNodePrismaAdapter {
  prisma: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
  }

  upsert(id: string, create: CreateShareInput, update: UpdateShareInput): Promise<Share> {
    return this.prisma.share.upsert({
      where: {
        id,
      },
      create: {
        title: create.title,
        tooltip: create.tooltip,
        url: create.url,
        questionNode: {
          connect: {
            id: create.questionId
          }
        }
      },
      update: {
        title: update.title,
        tooltip: update.tooltip,
        url: update.url,
      },
    });
  };

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

  delete(id: string) {
    return this.prisma.share.delete({ where: { id } });
  }
}

export default ShareNodePrismaAdapter;
