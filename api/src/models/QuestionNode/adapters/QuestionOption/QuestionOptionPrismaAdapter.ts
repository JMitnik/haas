import { QuestionOptionPrismaAdapterType } from "./QuestionOptionPrismaAdapterType";
import { PrismaClient, QuestionOptionCreateInput, QuestionOptionUpdateInput } from "@prisma/client";

class QuestionOptionPrismaAdapter implements QuestionOptionPrismaAdapterType {
  prisma: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
  }

  deleteMany(optionIds: number[]): Promise<import("@prisma/client").BatchPayload> {
    return this.prisma.questionOption.deleteMany({ where: { id: { in: optionIds } } });
  }

  upsert(id: number, create: QuestionOptionCreateInput, update: QuestionOptionUpdateInput): Promise<import("@prisma/client").QuestionOption> {
    return this.prisma.questionOption.upsert({
      where: { id },
      create,
      update,
    })
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
