import { Prisma, PrismaClient } from 'prisma/prisma-client';

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
      prisma.userOfCustomer.deleteMany({}),
      prisma.user.deleteMany({}),
      prisma.delivery.deleteMany({}),
      prisma.campaignVariantCustomVariable.deleteMany({}),
      prisma.campaignVariantToCampaign.deleteMany({}),
      prisma.campaignVariant.deleteMany({}),
      prisma.campaign.deleteMany({}),
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
        }
      }
    }
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
      permissions: ['CAN_CREATE_DELIVERIES']
    }
  });

  await prisma.userOfCustomer.create({
    data: {
      customer: { connect: { id: workspace.id } },
      user: { connect: { id: user.id } },
      role: { connect: { id: userRole.id } }
    }
  });

  const campaign = await prisma.campaign.create({
    data: {
      label: 'Hmm',
      workspace: { connect: { id: workspace.id } },
      variantsEdges: {
        create: [
          {
            weight: 50,
            campaignVariant: {
              create: {
                body: 'Hello',
                label: 'Hello',
                type: 'EMAIL',
                workspace: { connect: { id: workspace.id } },
                dialogue: { connect: { id: 'TEST_DIALOGUE' } },
              }
            }
          },
          {
            weight: 50,
            campaignVariant: {
              create: {
                body: 'HelloB',
                label: 'HelloB',
                type: 'EMAIL',
                workspace: { connect: { id: workspace.id } },
                dialogue: { connect: { id: 'TEST_DIALOGUE' } },
              }
            }
          },
        ]
      }
    }
  });

  return {
    user,
    userRole,
    campaign,
    workspace
  }
};
