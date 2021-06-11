import { QuestionOfTriggerPrismaAdapterType } from "./QuestionOfTriggerPrismaAdapterType";
import { PrismaClient, QuestionOfTriggerCreateInput } from "@prisma/client";

class QuestionOfTriggerPrismaAdapter implements QuestionOfTriggerPrismaAdapterType {
  prisma: PrismaClient;
  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
  }

  create(data: QuestionOfTriggerCreateInput): Promise<import("@prisma/client").QuestionOfTrigger> {
    return this.prisma.questionOfTrigger.create({
      data,
    });
  };
  
  deleteManyByTriggerId(triggerId: string): Promise<import("@prisma/client").BatchPayload> {
    return this.prisma.questionOfTrigger.deleteMany({ where: { triggerId: triggerId } });
  }
  async findDialogueByTriggerId(triggerId: string): Promise<import("@prisma/client").Dialogue | null> {
    const questionsOfTrigger = await this.prisma.questionOfTrigger.findMany({
      where: {
        triggerId: triggerId,
      },
      include: {
        question: {
          select: {
            questionDialogue: true,
          },
        },
      },
    });

    if (!questionsOfTrigger.length) return null;

    return questionsOfTrigger[0].question.questionDialogue;
  }
  async findOneQuestion(triggerId: string, triggerConditionId: number): Promise<import("@prisma/client").QuestionNode | null> {
    const questionOfTrigger = await this.prisma.questionOfTrigger.findMany({
      where: {
        triggerId: triggerId,
        triggerConditionId: triggerConditionId,
      },
      include: {
        question: true,
      },
    });

    if (!questionOfTrigger.length) return null;

    return questionOfTrigger[0].question;
  }
}

export default QuestionOfTriggerPrismaAdapter;
