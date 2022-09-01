import { Prisma, PrismaClient } from '@prisma/client';
import cuid from 'cuid';

export const createQuestionCreateInputs = (
  dialogueSlug: string,
  dialogueId: string,
): Prisma.Enumerable<Prisma.QuestionNodeCreateOrConnectWithoutQuestionDialogueInput> => {
  return [
    {
      where: {
        id: `${dialogueSlug}_SLIDER_QUESTION_ID`,
      },
      create: {
        id: `${dialogueSlug}_SLIDER_QUESTION_ID`,
        title: 'Slider question',
        topic: {
          connectOrCreate: {
            where: {
              name: 'SLIDER',
            },
            create: {
              name: 'SLIDER',
            },
          },
        },
        type: 'SLIDER',
        isRoot: true,
        children: {
          create: [
            {
              id: `${dialogueSlug}_NEGATIVE_EDGE`,
              dialogue: {
                connect: {
                  id: dialogueId,
                },
              },
              parentNode: {
                connect: {
                  id: `${dialogueSlug}_SLIDER_QUESTION_ID`,
                },
              },
              conditions: {
                create: {
                  conditionType: 'valueBoundary',
                  renderMax: 50,
                  renderMin: 0,
                },
              },
              childNode: {
                connectOrCreate: {
                  create: {
                    questionDialogue: {
                      connect: {
                        id: dialogueId,
                      },
                    },
                    id: `${dialogueSlug}_NEGATIVE_CHOICE_QUESTION_ID`,
                    title: 'Choice question #1',
                    topic: {
                      connectOrCreate: {
                        where: {
                          name: 'NEGATIVE',
                        },
                        create: {
                          name: 'NEGATIVE',
                        },
                      },
                    },
                    type: 'CHOICE',
                    options: {
                      create: [
                        {
                          value: 'Facilities',
                        },
                        {
                          value: 'Website',
                        },
                        {
                          value: 'Services',
                        },
                      ],
                    },
                  },
                  where: {
                    id: `${dialogueSlug}_NEGATIVE_CHOICE_QUESTION_ID`,
                  },
                },
              },
            },

            {
              id: `${dialogueSlug}_POSITIVE_EDGE`,
              dialogue: {
                connect: {
                  id: dialogueId,
                },
              },
              parentNode: {
                connect: {
                  id: `${dialogueSlug}_SLIDER_QUESTION_ID`,
                },
              },
              conditions: {
                create: {
                  conditionType: 'valueBoundary',
                  renderMax: 100,
                  renderMin: 50,
                },
              },
              childNode: {
                connectOrCreate: {
                  create: {
                    questionDialogue: {
                      connect: {
                        id: dialogueId,
                      },
                    },
                    id: `${dialogueSlug}_POSITIVE_CHOICE_QUESTION_ID`,
                    title: 'Choice question #2',
                    topic: {
                      connectOrCreate: {
                        where: {
                          name: 'POSITIVE',
                        },
                        create: {
                          name: 'POSITIVE',
                        },
                      },
                    },
                    type: 'CHOICE',
                    options: {
                      create: [
                        {
                          value: 'Facilities',
                        },
                        {
                          value: 'Website',
                        },
                        {
                          value: 'Services',
                        },
                      ],
                    },
                  },
                  where: {
                    id: `${dialogueSlug}_POSITIVE_CHOICE_QUESTION_ID`,
                  },
                },
              },
            },
          ],
        },
      },
    },
    {
      where: {
        id: `${dialogueSlug}_CTA`,
      },
      create: {
        id: `${dialogueSlug}_CTA`,
        topic: {
          connectOrCreate: {
            where: {
              name: 'TEST_CTA_TOPIC',
            },
            create: {
              name: 'TEST_CTA_TOPIC',
            },
          },
        },
        isLeaf: true,
        title: 'CTA',
      },
    },
  ]
}

/**
 * Generates a dialogue, connected to a specific dialogue.
 * @param prisma
 * @param customerId
 * @returns
 */
export const seedDialogue = async (
  prisma: PrismaClient,
  workspaceId: string,
  slug: string,
  isPrivate: boolean = false,
  title: string = 'Test dialogue',
  description: string = 'none',
) => {
  const dialogueId = cuid();
  const dialogue = await prisma.dialogue.create({
    data: {
      id: dialogueId,
      customerId: workspaceId,
      title,
      slug,
      template: 'DEFAULT',
      description: description,
      isPrivate,
      questions: {
        connectOrCreate: createQuestionCreateInputs(slug, dialogueId),
      },
    },
  });

  return dialogue;
}

export const prepDefaultCreateData = async (prisma: PrismaClient) => {
  const workspace = await prisma.customer.create({
    data: {
      name: 'Test',
      slug: 'customerSlug',
    },
  });

  const workspaceTwo = await prisma.customer.create({
    data: {
      name: 'Test2',
      slug: 'customerSlug2',
    },
  });

  const user = await prisma.user.create({
    data: {
      id: 'TEST_USER',
      email: 'TEST@Hotmail.com',
      globalPermissions: [],
    },
  });

  const userRole = await prisma.role.create({
    data: {
      name: 'UserRole',
      permissions: ['CAN_VIEW_DIALOGUE', 'CAN_EDIT_DIALOGUE', 'CAN_BUILD_DIALOGUE'],
    },
  });

  await prisma.userOfCustomer.create({
    data: {
      customer: { connect: { id: workspace.id } },
      user: { connect: { id: user.id } },
      role: { connect: { id: userRole.id } },
    },
  });

  await prisma.userOfCustomer.create({
    data: {
      customer: { connect: { id: workspaceTwo.id } },
      user: { connect: { id: user.id } },
      role: { connect: { id: userRole.id } },
    },
  });

  return {
    user,
    userRole,
    workspace,
    workspaceTwo,
  }
};

export const clearDialogueDatabase = async (prisma: PrismaClient) => {
  await prisma.$transaction([
    prisma.sliderNodeEntry.deleteMany({}),
    prisma.choiceNodeEntry.deleteMany({}),
    prisma.nodeEntry.deleteMany({}),
    prisma.session.deleteMany({}),
    prisma.automation.deleteMany({}),
    prisma.automationTrigger.deleteMany({}),
    prisma.automationEvent.deleteMany({}),
    prisma.automationConditionOperand.deleteMany({}),
    prisma.dialogueConditionScope.deleteMany({}),
    prisma.questionConditionScope.deleteMany({}),
    prisma.workspaceConditionScope.deleteMany({}),
    prisma.automationCondition.deleteMany({}),
    prisma.automationConditionBuilder.deleteMany({}),
    prisma.automationAction.deleteMany({}),
    prisma.questionCondition.deleteMany({}),
    prisma.edge.deleteMany({}),
    prisma.questionOption.deleteMany({}),
    prisma.userOfCustomer.deleteMany({}),
    prisma.user.deleteMany({}),
    prisma.questionStatisticsSummaryCache.deleteMany({}),
    prisma.topic.deleteMany({}),
    prisma.questionNode.deleteMany({}),
    prisma.tag.deleteMany({}),
    prisma.dialogue.deleteMany({}),
    prisma.customer.deleteMany({}),
  ]);
}