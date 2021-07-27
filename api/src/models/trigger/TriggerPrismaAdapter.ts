import { PrismaClient, TriggerUpdateInput, Trigger, BatchPayload, TriggerCondition, Dialogue, QuestionNode } from "@prisma/client";
import { CreateQuestionOfTriggerInput, CreateTriggerInput } from "./TriggerServiceType";

class TriggerPrismaAdapter {
  prisma: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
  };

  async getQuestionByTriggerProps(triggerId: string, triggerConditionId: number): Promise<QuestionNode | null> {
    const questionOfTrigger = await this.prisma.questionOfTrigger.findFirst({
      where: {
        triggerId: triggerId,
        triggerConditionId: triggerConditionId,
      },
      include: {
        question: true,
      },
    });

    if (!questionOfTrigger) return null;

    return questionOfTrigger.question;
  }

  async getDialogueByTriggerId(triggerId: string): Promise<Dialogue | null> {
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

  deleteQuestionsByTriggerId(triggerId: string): Promise<BatchPayload> {
    return this.prisma.questionOfTrigger.deleteMany({ where: { triggerId: triggerId } });
  };

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
  };

  async deleteQuestionsByTriggerConditionId(triggerConditionId: number) {
    return this.prisma.questionOfTrigger.deleteMany({ where: { triggerConditionId } });
  }

  getConditionsByTriggerId(triggerId: string): Promise<TriggerCondition[]> {
    return this.prisma.triggerCondition.findMany({ where: { triggerId: triggerId }, orderBy: { createdAt: 'asc' } });
  };

  deleteConditionsByTriggerId(triggerId: string): Promise<BatchPayload> {
    return this.prisma.triggerCondition.deleteMany({ where: { triggerId: triggerId } });
  };

  async deleteConditionById(conditionId: number) {
    const deletedCondition = await this.prisma.triggerCondition.delete({ where: { id: conditionId } });
    return deletedCondition.id;
  };

  getTriggersByCustomerSlug(customerSlug: string) {
    return this.prisma.trigger.findMany({
      where: {
        customer: {
          slug: customerSlug,
        },
      },
    })
  }

  getTriggersByUserId(userId: string) {
    return this.prisma.trigger.findMany({
      where: {
        recipients: {
          some: {
            id: userId,
          },
        },
      },
    })
  }

  upsertQuestionOfTrigger(input: CreateQuestionOfTriggerInput) {
    return this.prisma.questionOfTrigger.upsert({
      where: {
        questionId_triggerId: {
          questionId: input.condition.questionId || '-1',
          triggerId: input.triggerId || '-1',
        },
      },
      create: {
        question: {
          connect: {
            id: input.condition.questionId || undefined,
          },
        },
        trigger: {
          connect: {
            id: input.triggerId,
          },
        },
        triggerCondition: {
          create: {
            type: input.condition.type || undefined,
            minValue: input.condition.minValue,
            maxValue: input.condition.maxValue,
            textValue: input.condition.textValue,
            trigger: {
              connect: {
                id: input.triggerId,
              },
            },
          },
        },
      },
      update: {
        question: {
          connect: {
            id: input.condition.questionId || undefined,
          },
        },
        triggerCondition: {
          update: {
            type: input.condition.type || undefined,
            minValue: input.condition.minValue,
            maxValue: input.condition.maxValue,
            textValue: input.condition.textValue,
          },
        },
      },
    });

  }

  findTriggersByQuestionIds = async (questionIds: Array<string>) => {
    const questionOfTriggerEntries = await this.prisma.questionOfTrigger.findMany({
      where: {
        questionId: {
          in: questionIds,
        },
      },
    });

    const triggerIds = questionOfTriggerEntries.map((entry) => entry.triggerId);

    return this.prisma.trigger.findMany({
      where: {
        type: 'QUESTION',
        id: {
          in: triggerIds,
        },
      },
      include: {
        recipients: true,
        conditions: true,
        customer: {
          include: {
            settings: {
              include: {
                colourSettings: true,
              },
            },
          },
        },
        relatedNode: {
          select: {
            questionDialogue: {
              select: {
                title: true,
              },
            },
          },
        },
      },
    });
  };

  findTriggersByDialogueId = async (dialogueId: string) => this.prisma.trigger.findMany({
    where: {
      relatedNode: {
        questionDialogueId: dialogueId,
      },
    },
    include: {
      customer: {
        include: {
          settings: {
            include: {
              colourSettings: true,
            },
          },
        },
      },
    },
  });

  getQuestionsOfTriggerById(triggerId: string) {
    return this.prisma.questionOfTrigger.findMany({
      where: {
        triggerId: triggerId,
      },
      include: {
        question: true,
        triggerCondition: true,
      },
    });
  }

  updateLastSent(triggerId: string, lastSent: Date) {
    return this.prisma.trigger.update({
      where: {
        id: triggerId,
      },
      data: {
        lastSent,
      },
    });
  };

  create(data: CreateTriggerInput): Promise<Trigger> {
    const { name, type, customerSlug, medium, recipients } = data;
    return this.prisma.trigger.create({
      data: {
        name,
        type,
        medium,
        recipients: {
          connect: recipients,
        },
        customer: { connect: { slug: customerSlug } },
      },
    });
  };

  update(triggerId: string, data: TriggerUpdateInput): Promise<Trigger | null> {
    return this.prisma.trigger.update({
      where: {
        id: triggerId,
      },
      data,
    });
  };

  getById(triggerId: string) {
    return this.prisma.trigger.findOne({
      where: { id: triggerId },
      include: {
        conditions: true,
        recipients: true,
        relatedNode: true,
      },
    });
  };

  delete(triggerId: string): Promise<Trigger | null> {
    return this.prisma.trigger.delete({ where: { id: triggerId } });
  }
}

export default TriggerPrismaAdapter;
