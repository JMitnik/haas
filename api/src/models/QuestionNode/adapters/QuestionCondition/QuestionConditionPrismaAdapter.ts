import { QuestionConditionPrismaAdapterType } from "./QuestionConditionPrismaAdapterType";
import { PrismaClient, QuestionConditionUpdateInput, QuestionConditionCreateInput, QuestionCondition } from "@prisma/client";

class QuestionConditionPrismaAdapter implements QuestionConditionPrismaAdapterType {
  prisma: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
  }

  upsert(id: number, create: QuestionConditionCreateInput, update: QuestionConditionUpdateInput): Promise<QuestionCondition> {
    return this.prisma.questionCondition.upsert({
      where: { id },
      create,
      update,
    })
  }

  update(id: number | undefined, data: QuestionConditionUpdateInput): Promise<QuestionCondition> {
    return this.prisma.questionCondition.update({
      where: {
        id: id || undefined,
      },
      data,
    });
  }

  deleteManyByEdgeIds(edgeIds: string[]) {
    return this.prisma.questionCondition.deleteMany(
      {
        where: {
          edgeId: {
            in: edgeIds,
          },
        },
      },
    );
  }


}

export default QuestionConditionPrismaAdapter;
