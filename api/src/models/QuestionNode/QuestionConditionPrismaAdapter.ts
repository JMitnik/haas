import { QuestionConditionPrismaAdapterType } from "./QuestionConditionPrismaAdapterType";
import { PrismaClient } from "@prisma/client";

class QuestionConditionPrismaAdapter implements QuestionConditionPrismaAdapterType {
  prisma: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
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
