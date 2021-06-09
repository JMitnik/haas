import { QuestionNodePrismaAdapterType } from "./QuestionNodePrismaAdapterType";
import { PrismaClient, QuestionNodeUpdateInput, QuestionNodeCreateInput } from "@prisma/client";

class QuestionNodePrismaAdapter implements QuestionNodePrismaAdapterType {
  prisma: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
  }

  async updateDialogueBuilderNode(nodeId: string, data: QuestionNodeUpdateInput) {
    return this.prisma.questionNode.update({
      where: { id: nodeId },
      data: data,
      include: {
        videoEmbeddedNode: true,
      }
    })
  }

  getDialogueBuilderNode(nodeId: string): Promise<(import("@prisma/client").QuestionNode & { videoEmbeddedNode: import("@prisma/client").VideoEmbeddedNode | null; children: import("@prisma/client").Edge[]; options: import("@prisma/client").QuestionOption[]; questionDialogue: { id: string; } | null; overrideLeaf: { id: string; } | null; }) | null> {
    return this.prisma.questionNode.findOne({
      where: { id: nodeId },
      include: {
        videoEmbeddedNode: true,
        children: true,
        options: true,
        questionDialogue: {
          select: {
            id: true,
          },
        },
        overrideLeaf: {
          select: {
            id: true,
          },
        },
      }
    });
  }

  create(data: QuestionNodeCreateInput): Promise<import("@prisma/client").QuestionNode> {
    return this.prisma.questionNode.create({
      data,
    });
  };

  async getCTANode(nodeId: string) {
    const existingNode = await this.prisma.questionNode.findOne({
      where: { id: nodeId },
      include: {
        links: true,
        share: true,
        form: {
          include: {
            fields: true,
          },
        },
      },
    });
    return existingNode;
  }


  async getNodeByLinkId(linkId: string) {
    const link = await this.prisma.link.findOne({
      where: { id: linkId },
      include: { questionNode: true },
    });

    return link?.questionNode;
  }


  update(nodeId: string, data: QuestionNodeUpdateInput): Promise<import("@prisma/client").QuestionNode> {
    return this.prisma.questionNode.update({
      where: {
        id: nodeId,
      },
      data,
    });
  }


  async getNodeById(nodeId: string): Promise<import("@prisma/client").QuestionNode | null> {
    return this.prisma.questionNode.findOne({
      where: { id: nodeId },
    });
  }

  async deleteMany(questionIds: string[]): Promise<import("@prisma/client").BatchPayload> {
    return this.prisma.questionNode.deleteMany(
      {
        where: {
          id: {
            in: questionIds,
          },
        },
      },
    );
  }

}

export default QuestionNodePrismaAdapter;
