import { PrismaClient, SystemPermissionEnum } from '@prisma/client';

export const clearDatabase = async (prisma: PrismaClient) => {
  if (process.env.NODE_ENV === 'test') {
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
      prisma.automationAction.deleteMany({}),
      prisma.userOfCustomer.deleteMany({}),
      prisma.user.deleteMany({}),
      prisma.questionNode.deleteMany({}),
      prisma.dialogue.deleteMany({}),
      prisma.customer.deleteMany({}),
    ]);
  }
}

export const seedAutomation = async (
  prisma: PrismaClient,
  workspaceId: string,
  dialogueId: string,
  questionId: string,
  index?: number,
  desc?: string
) => {
  return prisma.automation.create({
    data: {
      label: `Trigger automation ${index}`,
      description: desc,
      type: 'TRIGGER',
      isActive: true,
      workspace: {
        connect: {
          id: workspaceId,
        },
      },
      automationTrigger: {
        create: {
          event: {
            create: {
              type: 'NEW_INTERACTION_QUESTION',
              question: {
                connect: {
                  id: questionId,
                },
              },
            },
          },
          conditions: {
            create: [
              {
                question: {
                  connect: {
                    id: questionId,
                  },
                },
                scope: 'QUESTION',
                operator: 'SMALLER_OR_EQUAL_THAN',
                questionScope: {
                  create: {
                    aspect: 'NODE_VALUE',
                    aggregate: {
                      create: {
                        type: 'AVG',
                        latest: 10,
                      },
                    },
                  },
                },
                operands: {
                  create: {
                    type: 'INT',
                    numberValue: 50,
                  },
                },
              },
              {
                dialogue: {
                  connect: {
                    id: dialogueId,
                  },
                },
                scope: 'DIALOGUE',
                operator: 'GREATER_THAN',
                dialogueScope: {
                  create: {
                    aspect: 'NR_INTERACTIONS',
                    aggregate: {
                      create: {
                        type: 'COUNT',
                        latest: 10,
                      },
                    },
                  },
                },
                operands: {
                  create: {
                    type: 'INT',
                    numberValue: 10,
                  },
                },
              },
            ],
          },
          actions: {
            create: [
              { type: 'GENERATE_REPORT' },
              { type: 'SEND_EMAIL' },
            ],
          },
        },
      },
    },
    include: {
      workspace: true,
      automationTrigger: {
        include: {
          event: {
            include: {
              question: true,
              dialogue: true,
            },
          },
          conditions: {
            include: {
              questionScope: {
                include: {
                  aggregate: true,
                },
              },
              dialogueScope: {
                include: {
                  aggregate: true,
                },
              },
              operands: true,
              workspaceScope: {
                include: {
                  aggregate: true,
                },
              },
              dialogue: true,
              question: true,
            },
          },
          actions: true,
        },
      },
    },
  })
}

export const prepDefaultUpdateData = async (
  prisma: PrismaClient,
  roleId: string,
  workspaceId: string,
  dialogueId: string,
  questionId: string
) => {
  await prisma.role.update({
    where: {
      id: roleId,
    },
    data: {
      permissions: ['CAN_UPDATE_AUTOMATIONS'],
    },
  });

  const automation = await seedAutomation(prisma, workspaceId, dialogueId, questionId);

  return {
    automation,
  }
}

export const prepDefaultCreateData = async (prisma: PrismaClient, globalPermissions?: SystemPermissionEnum[]) => {
  const workspace = await prisma.customer.create({
    data: {
      name: 'Test',
      slug: 'test',
      dialogues: {
        create: {
          id: 'TEST_DIALOGUE',
          description: '',
          slug: 'test',
          title: 'test',
          questions: {
            create: {
              id: 'QUESTION_ID',
              title: 'Slider question',
              type: 'SLIDER',
            },
          },
        },
      },
    },
    include: {
      dialogues: {
        include: {
          questions: true,
        },
      },
    },
  });

  const user = await prisma.user.create({
    data: {
      id: 'TEST_USER',
      email: 'TEST@Hotmail.com',
      globalPermissions: globalPermissions || [],
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

  return {
    user,
    userRole,
    workspace,
    dialogue: workspace?.dialogues[0],
    question: workspace?.dialogues[0]?.questions[0],
  }
};
