import { PrismaClient, EdgeCreateInput, BatchPayload, Edge, QuestionCondition, QuestionConditionUpdateInput, QuestionConditionCreateInput } from "@prisma/client";

export interface CreateEdgeInput {
  id?: string;
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
  };

  getEdgesByDialogueId(dialogueId: string) {
    return this.prisma.edge.findMany({
      where: {
        dialogueId: dialogueId,
      },
      include: {
        conditions: true,
      }
    });
  }

  getEdgesByParentQuestionId(parentId: string): Promise<Edge[]> {
    return this.prisma.edge.findMany({
      where: {
        parentNodeId: parentId,
      },
    });
  }

  createEdge(input: CreateEdgeInput) {
    return this.prisma.edge.create({
      data: {
        id: input.id,
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
  };

  async getEdgeById(edgeId: string) {
    return this.prisma.edge.findOne({
      where: { id: edgeId },
      include: { conditions: true }
    });
  };

  upsertCondition(id: number, create: QuestionConditionCreateInput, update: QuestionConditionUpdateInput): Promise<QuestionCondition> {
    return this.prisma.questionCondition.upsert({
      where: { id },
      create,
      update,
    })
  }

  updateCondition(id: number | undefined, data: QuestionConditionUpdateInput): Promise<QuestionCondition> {
    return this.prisma.questionCondition.update({
      where: {
        id: id || undefined,
      },
      data,
    });
  }

  deleteConditionsByEdgeIds(edgeIds: string[]) {
    return this.prisma.questionCondition.deleteMany(
      {
        where: {
          edgeId: {
            in: edgeIds,
          },
        },
      },
    );
  };

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
