import { QuestionOfTriggerPrismaAdapterType } from "./QuestionOfTriggerPrismaAdapterType";
import { PrismaClient } from "@prisma/client";

class QuestionOfTriggerPrismaAdapter implements QuestionOfTriggerPrismaAdapterType {
  prisma: PrismaClient;
  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
  }
}

export default QuestionOfTriggerPrismaAdapter;
