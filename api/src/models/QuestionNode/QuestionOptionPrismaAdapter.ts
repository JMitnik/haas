import { QuestionOptionPrismaAdapterType } from "./QuestionOptionPrismaAdapterType";
import { PrismaClient } from "@prisma/client";

class QuestionOptionPrismaAdapter implements QuestionOptionPrismaAdapterType {
  prisma: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
  }

  deleteManyByQuestionIds(questionIds: string[]): Promise<import("@prisma/client").BatchPayload> {
    return this.prisma.questionOption.deleteMany(
      {
        where: {
          questionNodeId: {
            in: questionIds,
          },
        },
      },
    );
  }
}

export default QuestionOptionPrismaAdapter;
