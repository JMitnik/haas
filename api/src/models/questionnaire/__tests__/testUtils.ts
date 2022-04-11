import { PrismaClient, SystemPermissionEnum } from '@prisma/client';

export const assignUserToDialogue = async (prisma: PrismaClient, dialogueId: string, userId: string) => {
  return prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      isAssignedTo: {
        connect: {
          id: dialogueId,
        },
      },
    },
    include: {
      isAssignedTo: true,
    },
  });
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
  const dialogue = await prisma.dialogue.create({
    data: {
      customerId: workspaceId,
      title,
      slug,
      description: description,
      isPrivate,
    },
  });

  return dialogue;
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
      permissions: ['CAN_VIEW_DIALOGUE'],
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

export const clearDialogueDatabase = async (prisma: PrismaClient) => {
  const deleteSliderNodes = prisma.sliderNode.deleteMany({});
  const deleteTextBoxNodes = prisma.textboxNodeEntry.deleteMany({});
  const deleteRegistrationNodes = prisma.registrationNodeEntry.deleteMany({});
  const deleteLinkNodes = prisma.linkNodeEntry.deleteMany({});
  const deleteChoiceNodes = prisma.choiceNodeEntry.deleteMany({});
  const deleteNodeEntries = prisma.nodeEntry.deleteMany({});
  const deleteSessions = prisma.session.deleteMany({});
  const deleteUserOfCustomer = prisma.userOfCustomer.deleteMany({});
  const deleteEdgeConditions = prisma.questionCondition.deleteMany({})
  const deleteEdges = prisma.edge.deleteMany({});
  const deleteQuestionOptions = prisma.questionOption.deleteMany({});
  const deleteQuestions = prisma.questionNode.deleteMany({});
  const deleteTags = prisma.tag.deleteMany({});
  const deleteUsers = prisma.user.deleteMany({});
  const deleteDialogues = prisma.dialogue.deleteMany({});
  const deleteCustomers = prisma.customer.deleteMany({});

  await prisma.$transaction([
    deleteUserOfCustomer,
    deleteSliderNodes,
    deleteTextBoxNodes,
    deleteRegistrationNodes,
    deleteLinkNodes,
    deleteChoiceNodes,
    deleteNodeEntries,
    deleteSessions,
    deleteEdgeConditions,
    deleteEdges,
    deleteQuestionOptions,
    deleteQuestions,
    deleteTags,
    deleteUsers,
    deleteDialogues,
    deleteCustomers,
  ]);
}