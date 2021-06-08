import { QuestionNodePrismaAdapterType } from "./QuestionNodePrismaAdapterType";
import { PrismaClient, QuestionNodeUpdateInput } from "@prisma/client";

class QuestionNodePrismaAdapter implements QuestionNodePrismaAdapterType {
  prisma: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
  }

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
