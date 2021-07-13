import { PrismaClient, EdgeCreateInput, BatchPayload, Edge, QuestionCondition } from "@prisma/client";

import { EdgePrismaAdapterType } from "./EdgePrismaAdapterType";

class EdgePrismaAdapter implements EdgePrismaAdapterType {
  prisma: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
  }

  findManyByParentId(parentId: string): Promise<Edge[]> {
    return this.prisma.edge.findMany({
      where: {
        parentNodeId: parentId,
      },
    });
  }

  create(data: EdgeCreateInput): Promise<Edge> {
    return this.prisma.edge.create({
      data
    })
  }

  async getEdgeById(edgeId: string) {
    return this.prisma.edge.findOne({
      where: { id: edgeId },
      include: { conditions: true }
    });
  }

  async getConditionsById(edgeId: string): Promise<QuestionCondition[]> {
    return this.prisma.questionCondition.findMany({
      where: { edgeId },
    });
  }

  async deleteMany(edgeIds: string[]): Promise<BatchPayload> {
    return this.prisma.edge.deleteMany(
      {
        where: {
          id: {
            in: edgeIds,
          },
        },
      },
    );
  }

}

export default EdgePrismaAdapter;
