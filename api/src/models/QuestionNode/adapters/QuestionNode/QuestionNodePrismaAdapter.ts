import { QuestionNodePrismaAdapterType } from "./QuestionNodePrismaAdapterType";
import { PrismaClient, QuestionNodeUpdateInput, QuestionNodeCreateInput, BatchPayload, Edge, QuestionNode, QuestionOption, VideoEmbeddedNode } from "@prisma/client";

class QuestionNodePrismaAdapter implements QuestionNodePrismaAdapterType {
  prisma: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
  }

  delete(id: string): Promise<QuestionNode> {
    return this.prisma.questionNode.delete({
      where: {
        id,
      }
    });
  };

  async updateDialogueBuilderNode(nodeId: string, data: QuestionNodeUpdateInput) {
    return this.prisma.questionNode.update({
      where: { id: nodeId },
      data: data,
      include: {
        videoEmbeddedNode: true,
      }
    })
  }

  getDialogueBuilderNode(nodeId: string): Promise<(QuestionNode & { videoEmbeddedNode: VideoEmbeddedNode | null; children: Edge[]; options: QuestionOption[]; questionDialogue: { id: string; } | null; overrideLeaf: { id: string; } | null; }) | null> {
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

  create(data: QuestionNodeCreateInput): Promise<QuestionNode> {
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


  update(nodeId: string, data: QuestionNodeUpdateInput): Promise<QuestionNode> {
    return this.prisma.questionNode.update({
      where: {
        id: nodeId,
      },
      data,
    });
  }


  async getNodeById(nodeId: string): Promise<QuestionNode | null> {
    return this.prisma.questionNode.findOne({
      where: { id: nodeId },
    });
  }

  async deleteMany(questionIds: string[]): Promise<BatchPayload> {
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
