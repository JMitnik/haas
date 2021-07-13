import { QuestionOptionPrismaAdapterType } from "./QuestionOptionPrismaAdapterType";
import { BatchPayload, PrismaClient, QuestionOption, QuestionOptionCreateInput, QuestionOptionUpdateInput } from "@prisma/client";

class QuestionOptionPrismaAdapter implements QuestionOptionPrismaAdapterType {
  prisma: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
  }

  findOptionsByParentId(parentId: string) {
    return this.prisma.questionOption.findMany({
      where: { questionNodeId: parentId },
      include: {
        overrideLeaf: true
      }
    });
  }

  deleteMany(optionIds: number[]): Promise<BatchPayload> {
    return this.prisma.questionOption.deleteMany({ where: { id: { in: optionIds } } });
  }

  upsert(id: number, create: QuestionOptionCreateInput, update: QuestionOptionUpdateInput): Promise<QuestionOption> {
    return this.prisma.questionOption.upsert({
      where: { id },
      create,
      update,
    })
  }

  deleteManyByQuestionIds(questionIds: string[]): Promise<BatchPayload> {
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
