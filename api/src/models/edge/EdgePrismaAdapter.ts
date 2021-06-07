import { PrismaClient, EdgeCreateInput } from "@prisma/client";

import { EdgePrismaAdapterType } from "./EdgePrismaAdapterType";

class EdgePrismaAdapter implements EdgePrismaAdapterType {
  prisma: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
  }

  create(data: EdgeCreateInput): Promise<import("@prisma/client").Edge> {
    return this.prisma.edge.create({
      data
    })
  }

  async getEdgeById(edgeId: string) {
    return this.prisma.edge.findOne({ where: { id: edgeId} });;
  }

  async getConditionsById(edgeId: string): Promise<import("@prisma/client").QuestionCondition[]> {
    return this.prisma.questionCondition.findMany({
      where: { edgeId },
    });
  }

  async deleteMany(edgeIds: string[]): Promise<import("@prisma/client").BatchPayload> {
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
