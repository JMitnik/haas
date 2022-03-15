import { NodeType, PrismaClient } from '@prisma/client';
import { sample } from 'lodash';

export const seedSession = async (
  prisma: PrismaClient,
  dialogueId: string,
  sliderQuestionId?: string,
  sliderValue?: number,
  choiceQuestionId?: string,
  choiceValue?: string,
  createdAt?: string,
) => {
  const session = prisma.session.create({
    data: {
      createdAt: createdAt,
      browser: sample(['Firefox', 'IEEdge', 'Chrome', 'Safari']),
      dialogueId,
      device: sample(['iPhone', 'Android', 'Mac', 'Windows ']),
      nodeEntries: {
        create: [{
          depth: 0,
          relatedNode: {
            create: !sliderQuestionId ? { title: 'Test', type: NodeType.SLIDER } : undefined,
            connect: sliderQuestionId ? { id: sliderQuestionId } : undefined,
          },
          sliderNodeEntry: {
            create: { value: sliderValue || Math.floor(Math.random() * 100) },
          },
        },
        {
          depth: 1,
          choiceNodeEntry: {
            create: {
              value: choiceValue || sample(['Customer support', 'Facilities', 'Website', 'Application']),
            },
          },
          relatedNode: {
            create: !choiceQuestionId ? { title: 'What did you think of this?', type: NodeType.CHOICE } : undefined,
            connect: choiceQuestionId ? { id: choiceQuestionId } : undefined,
          },
        },
        ],
      },
    },
  });

  return session;
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
            createMany: {
              data: [
                {
                  id: 'SLIDER_QUESTION_ID',
                  title: 'Slider question',
                  type: 'SLIDER',
                },
                {
                  id: 'CHOICE_QUESTION_ID',
                  title: 'Choice question',
                  type: 'CHOICE',
                },
              ],
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

  return {
    user,
    userRole,
    workspace,
    dialogue: workspace?.dialogues[0],
    sliderQuestion: workspace?.dialogues[0]?.questions[0],
    choiceQuestion: workspace?.dialogues[0]?.questions[1],
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
    prisma.userOfCustomer.deleteMany({}),
    prisma.user.deleteMany({}),
    prisma.questionNode.deleteMany({}),
    prisma.dialogue.deleteMany({}),
    prisma.customer.deleteMany({}),
  ]);
}