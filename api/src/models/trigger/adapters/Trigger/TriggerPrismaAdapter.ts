import { PrismaClient, TriggerUpdateInput, TriggerCreateInput, Trigger } from "@prisma/client";
import { CreateTriggerInput } from "../../TriggerService";
import { CreateQuestionOfTriggerInput } from "../QuestionOfTrigger/QuestionOfTriggerPrismaAdapter";



class TriggerPrismaAdapter {
  prisma: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
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
