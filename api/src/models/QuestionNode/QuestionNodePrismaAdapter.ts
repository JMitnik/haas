import { QuestionNodePrismaAdapterType } from "./QuestionNodePrismaAdapterType";
import { PrismaClient } from "@prisma/client";

class QuestionNodePrismaAdapter implements QuestionNodePrismaAdapterType {
  prisma: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
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
