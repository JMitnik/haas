import { PrismaClient, EdgeCreateInput, BatchPayload, Edge, QuestionCondition } from "@prisma/client";

export interface CreateEdgeInput {
  dialogueId: string;
  parentNodeId: string;
  conditions: Array<{
    renderMin: number | null,
    renderMax: number | null,
    matchValue: string | null,
    conditionType: string,
  }>;
  childNodeId: string;
}

class EdgePrismaAdapter {
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

  createEdge(input: CreateEdgeInput) {
    return this.prisma.edge.create({
      data: {
        dialogue: {
          connect: {
            id: input.dialogueId,
          }
        },
        parentNode: {
          connect: {
            id: input.parentNodeId,
          },
        },
        conditions: {
          create: input.conditions,
        },
        childNode: {
          connect: {
            id: input.childNodeId,
          },
        },
      },
    });
  };

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
