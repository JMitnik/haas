import { Dialogue, Edge, PrismaClient, QuestionCondition, QuestionNode } from '@prisma/client';

export const clearDatabase = async (prisma: PrismaClient) => {
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
    prisma.questionNode.deleteMany({}),
    prisma.tag.deleteMany({}),
    prisma.dialogue.deleteMany({}),
    prisma.customer.deleteMany({}),
  ]);
}

export const clearCustomerDatabase = async (prisma: PrismaClient) => {
  const deleteTags = prisma.tag.deleteMany({});
  const deleteRoles = prisma.role.deleteMany({});
  const colourSettings = prisma.colourSettings.deleteMany({});
  const fontSettings = prisma.fontSettings.deleteMany({});
  const customerSettings = prisma.customerSettings.deleteMany({});
  const deleteDialogues = prisma.dialogue.deleteMany({});
  const deleteWorkspaces = prisma.customer.deleteMany({});


  await prisma.$transaction([
    deleteTags,
    deleteRoles,
    colourSettings,
    fontSettings,
    customerSettings,
    deleteDialogues,
    deleteWorkspaces,
  ]);
}

export const prepDefaultCreateData = async (prisma: PrismaClient) => {
  const workspace = await prisma.customer.create({
    data: {
      name: 'Test',
      slug: 'customerSlug',
      dialogues: {
        create: {
          id: 'TEST_DIALOGUE',
          description: '',
          slug: 'dialogueSlug',
          title: 'test',
          questions: {
            connectOrCreate: [
              {
                where: {
                  id: 'SLIDER_QUESTION_ID',
                },
                create: {
                  id: 'SLIDER_QUESTION_ID',
                  title: 'Slider question',
                  type: 'SLIDER',
                  isRoot: true,
                  children: {
                    create: [
                      {
                        dialogue: {
                          connect: {
                            id: 'TEST_DIALOGUE',
                          },
                        },
                        parentNode: {
                          connect: {
                            id: 'SLIDER_QUESTION_ID',
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
                                  id: 'TEST_DIALOGUE',
                                },
                              },
                              id: 'CHOICE_QUESTION_ID',
                              title: 'Choice question #1',
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
                              id: 'CHOICE_QUESTION_ID',
                            },
                          },
                        },
                      },
                    ],
                  },
                },
              },

              {
                create: {
                  id: 'SUB_CHOICE_QUESTION_ONE_ID',
                  title: 'Sub choice question #1',
                  type: 'CHOICE',
                  options: {
                    create: [
                      {
                        value: 'Cleanliness',
                      },
                      {
                        value: 'Atmosphere',
                      },
                    ],
                  },
                },
                where: {
                  id: 'SUB_CHOICE_QUESTION_ONE_ID',
                },
              },

              {
                create: {
                  id: 'SUB_CHOICE_QUESTION_TWO_ID',
                  title: 'Sub choice quesiton #2',
                  type: 'CHOICE',
                  options: {
                    create: [
                      {
                        value: 'Speed',
                      },
                      {
                        value: 'Responsive',
                      },
                    ],
                  },
                },
                where: {
                  id: 'SUB_CHOICE_QUESTION_TWO_ID',
                },
              },
            ],
          },
        },
      },
    },
    include: {
      dialogues: {
        include: {
          edges: {
            include: {
              conditions: true,
            },
          },
          questions: {
            include: {
              children: {
                include: {
                  parentNode: true,
                  childNode: true,
                  conditions: true,
                },
              },
            },
          },
        },
      },
    },
  });

  await prisma.questionNode.update({
    where: {
      id: 'CHOICE_QUESTION_ID',
    },
    data: {
      children: {
        create: [
          {
            dialogue: {
              connect: {
                id: 'TEST_DIALOGUE',
              },
            },
            parentNode: {
              connect: {
                id: 'CHOICE_QUESTION_ID',
              },
            },
            childNode: {
              connect: {
                id: 'SUB_CHOICE_QUESTION_ONE_ID',
              },
            },
            conditions: {
              create: {
                conditionType: 'match',
                matchValue: 'Facilities',
              },
            },
          },

          {
            dialogue: {
              connect: {
                id: 'TEST_DIALOGUE',
              },
            },
            parentNode: {
              connect: {
                id: 'CHOICE_QUESTION_ID',
              },
            },
            childNode: {
              connect: {
                id: 'SUB_CHOICE_QUESTION_TWO_ID',
              },
            },
            conditions: {
              create: {
                conditionType: 'match',
                matchValue: 'Website',
              },
            },
          },

        ],
      },
    },
  })

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
      permissions: ['CAN_VIEW_AUTOMATIONS', 'CAN_CREATE_AUTOMATIONS'],
    },
  });

  await prisma.userOfCustomer.create({
    data: {
      customer: { connect: { id: workspace.id } },
      user: { connect: { id: user.id } },
      role: { connect: { id: userRole.id } },
    },
  });

  const dialogue = await prisma.dialogue.findUnique({
    where: {
      id: 'TEST_DIALOGUE',
    },
    include: {
      edges: {
        include: {
          conditions: true,
        },
      },
      questions: {
        include: {
          children: {
            include: {
              parentNode: true,
              childNode: true,
              conditions: true,
            },
          },
        },
      },
    },
  });

  return {
    user,
    userRole,
    workspace,
    dialogue: dialogue as (Dialogue & {
      edges: (Edge & {
        conditions: QuestionCondition[];
      })[];
      questions: (QuestionNode & {
        children: (Edge & {
          conditions: QuestionCondition[];
          childNode: QuestionNode;
          parentNode: QuestionNode;
        })[];
      })[];
    }),
    sliderQuestion: workspace?.dialogues[0]?.questions.find((question) => question.id === 'SLIDER_QUESTION_ID') as QuestionNode,
    choiceQuestion: workspace?.dialogues[0]?.questions.find((question) => question.id === 'CHOICE_QUESTION_ID') as QuestionNode,
  }
};
