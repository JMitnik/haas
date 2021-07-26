import { BatchPayload, Dialogue, PrismaClient, QuestionNode, QuestionOfTrigger, QuestionOfTriggerCreateInput } from "@prisma/client";

import { CreateQuestionOfTriggerInput } from "./QuestionOfTriggerPrismaAdapterType";

class QuestionOfTriggerPrismaAdapter {
  prisma: PrismaClient;
  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
  }

  async deleteManyByTriggerConditionId(triggerConditionId: number) {
    await this.prisma.questionOfTrigger.deleteMany({ where: { triggerConditionId } });
  }

  createQuestionOfTrigger(data: CreateQuestionOfTriggerInput) {
    const { condition, triggerId } = data;
    return this.prisma.questionOfTrigger.create({
      data: {
        question: {
          connect: {
            id: condition?.questionId || undefined,
          },
        },
        trigger: {
          connect: {
            id: triggerId,
          },
        },
        triggerCondition: {
          create: {
            type: condition.type || 'TEXT_MATCH',
            maxValue: condition.maxValue,
            minValue: condition.minValue,
            textValue: condition.textValue,
            trigger: {
              connect: {
                id: triggerId,
              },
            },
          },
        },
      },
    });
  }

  create(data: QuestionOfTriggerCreateInput): Promise<QuestionOfTrigger> {
    return this.prisma.questionOfTrigger.create({
      data,
    });
  };

  deleteManyByTriggerId(triggerId: string): Promise<BatchPayload> {
    return this.prisma.questionOfTrigger.deleteMany({ where: { triggerId: triggerId } });
  }
  async findDialogueByTriggerId(triggerId: string): Promise<Dialogue | null> {
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
  async findOneQuestion(triggerId: string, triggerConditionId: number): Promise<QuestionNode | null> {
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
