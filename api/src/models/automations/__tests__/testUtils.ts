import { Prisma, PrismaClient } from '@prisma/client';

export const prepData = async (
  prisma: PrismaClient,
  createWorkspaceInput: Prisma.CustomerCreateInput,
  createDialogueInput: Prisma.DialogueCreateInput,
  createCampaignInput: Prisma.CampaignCreateInput,
  createDeliveriesInputs: Prisma.DeliveryCreateInput[],
) => {
  if (process.env.NODE_ENV === 'test') {
    await prisma.$transaction([
      prisma.customer.create({ data: createWorkspaceInput }),
      prisma.dialogue.create({ data: createDialogueInput }),
      prisma.campaign.create({ data: createCampaignInput }),
    ]);

    await Promise.all(createDeliveriesInputs.map(async createDeliveryInput => (
      await prisma.delivery.create({ data: createDeliveryInput })
    )));
  }
}

export const clearDatabase = async (prisma: PrismaClient) => {
  if (process.env.NODE_ENV === 'test') {
    await prisma.$transaction([
      prisma.automation.deleteMany({}),
      prisma.automationTrigger.deleteMany({}),
      prisma.automationEvent.deleteMany({}),
      prisma.automationCondition.deleteMany({}),
      prisma.automationConditionMatchValue.deleteMany({}),
      prisma.automationAction.deleteMany({}),
      prisma.userOfCustomer.deleteMany({}),
      prisma.user.deleteMany({}),
      prisma.questionNode.deleteMany({}),
      prisma.dialogue.deleteMany({}),
      prisma.customer.deleteMany({}),
    ]);
  }
}

export const prepDefaultData = async (prisma: PrismaClient) => {
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
            }
          }
        }
      }
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
    }
  });

  const userRole = await prisma.role.create({
    data: {
      name: 'UserRole',
      permissions: ['CAN_CREATE_AUTOMATIONS']
    }
  });

  await prisma.userOfCustomer.create({
    data: {
      customer: { connect: { id: workspace.id } },
      user: { connect: { id: user.id } },
      role: { connect: { id: userRole.id } }
    }
  });

  return {
    user,
    userRole,
    workspace,
    dialogue: workspace?.dialogues[0],
    question: workspace?.dialogues[0]?.questions[0]
  }
};
