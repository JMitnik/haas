import { Prisma, PrismaClient } from "@prisma/client";

export const clearDialogueDatabase = async (prisma: PrismaClient) => {
  const deleteSliderNodes = prisma.sliderNode.deleteMany({});
  const deleteTextBoxNodes = prisma.textboxNodeEntry.deleteMany({});
  const deleteRegistrationNodes = prisma.registrationNodeEntry.deleteMany({});
  const deleteLinkNodes = prisma.linkNodeEntry.deleteMany({});
  const deleteNodeEntries = prisma.nodeEntry.deleteMany({});
  const deleteSessions = prisma.session.deleteMany({});
  const deleteEdgeConditions = prisma.questionCondition.deleteMany({})
  const deleteEdges = prisma.edge.deleteMany({});
  const deleteQuestions = prisma.questionNode.deleteMany({});
  const deleteQuestionOptions = prisma.questionOption.deleteMany({});
  const deleteTags = prisma.tag.deleteMany({});
  const deleteDialogues = prisma.dialogue.deleteMany({});
  const deleteCustomers = prisma.customer.deleteMany({});

  await prisma.$transaction([
    prisma.sliderNodeEntry.deleteMany(),
    prisma.choiceNodeEntry.deleteMany(),
    deleteNodeEntries,
    deleteSessions,
    deleteEdges,
    deleteQuestions,
    deleteSliderNodes,
    deleteTextBoxNodes,
    deleteRegistrationNodes,
    deleteLinkNodes,
    deleteEdgeConditions,
    deleteQuestionOptions,
    deleteTags,
    deleteDialogues,
    deleteCustomers,
  ]);
}


const questionNodes: Prisma.QuestionNodeCreateInput[] = [
  {
    id: 'SLIDER_ROOT',
    isRoot: true,
    title: 'Slider',
    type: 'SLIDER',
  },
  {
    id: 'LEVEL_1_POSITIVE',
    title: 'Level 1 positive',
    type: 'CHOICE',
    isRoot: false,
  },
  {
    id: 'LEVEL_2_POSITIVE_Website',
    title: 'Level 2 positive Website',
    type: 'CHOICE',
    isRoot: false,
  },
  {
    id: 'LEVEL_2_POSITIVE_Facilities',
    title: 'Level 2 positive Website',
    type: 'CHOICE',
    isRoot: false,
  },
  {
    id: 'LEVEL_1_NEUTRAL',
    title: 'Level 1 neutral',
    type: 'CHOICE',
    isRoot: false,
  },
  {
    id: 'LEVEL_2_NEUTRAL_Website',
    title: 'Level 2 neutral Website',
    type: 'CHOICE',
    isRoot: false,
  },
  {
    id: 'LEVEL_2_NEUTRAL_Facilities',
    title: 'Level 2 neutral facilities',
    type: 'CHOICE',
    isRoot: false,
  },
  {
    id: 'LEVEL_1_NEGATIVE',
    title: 'Level 1 negative',
    type: 'CHOICE',
    isRoot: false,
  },
  {
    id: 'LEVEL_2_NEGATIVE_Website',
    title: 'Level 2 negative Website',
    type: 'CHOICE',
    isRoot: false,
  },
  {
    id: 'LEVEL_2_NEGATIVE_Facilities',
    title: 'Level 2 negative facilities',
    type: 'CHOICE',
    isRoot: false,
  },
];

const edges : Prisma.EdgeCreateInput[] = [
  {
    parentNode: { connect: { id: 'SLIDER_ROOT' } },
    childNode: { connect: { id: 'LEVEL_1_POSITIVE' } },
    conditions: { create: { conditionType: 'valueBoundary', renderMin: 60, renderMax: 100  } },
  },
  {
    parentNode: { connect: { id: 'LEVEL_1_POSITIVE' } },
    childNode: { connect: { id: 'LEVEL_2_POSITIVE_Website' } },
    conditions: { create: { conditionType: 'matchValue', matchValue: 'Website' } },
  },
  {
    parentNode: { connect: { id: 'LEVEL_1_POSITIVE' } },
    childNode: { connect: { id: 'LEVEL_2_POSITIVE_Facilities' } },
    conditions: { create: { conditionType: 'matchValue', matchValue: 'Facilities' } },
  },
  {
    parentNode: { connect: { id: 'SLIDER_ROOT' } },
    childNode: { connect: { id: 'LEVEL_1_NEUTRAL' } },
    conditions: { create: { conditionType: 'valueBoundary', renderMin: 30, renderMax: 60  } },
  },
  {
    parentNode: { connect: { id: 'LEVEL_1_NEUTRAL' } },
    childNode: { connect: { id: 'LEVEL_2_NEUTRAL_Website' } },
    conditions: { create: { conditionType: 'matchValue', matchValue: 'Website' } },
  },
  {
    parentNode: { connect: { id: 'LEVEL_1_NEUTRAL' } },
    childNode: { connect: { id: 'LEVEL_2_NEUTRAL_Facilities' } },
    conditions: { create: { conditionType: 'matchValue', matchValue: 'Facilities' } },
  },
  {
    parentNode: { connect: { id: 'SLIDER_ROOT' } },
    childNode: { connect: { id: 'LEVEL_1_NEGATIVE' } },
    conditions: { create: { conditionType: 'valueBoundary', renderMin: 0, renderMax: 30  } },
  },
  {
    parentNode: { connect: { id: 'LEVEL_1_NEGATIVE' } },
    childNode: { connect: { id: 'LEVEL_2_NEGATIVE_Website' } },
    conditions: { create: { conditionType: 'matchValue', matchValue: 'Website' } },
  },
  {
    parentNode: { connect: { id: 'LEVEL_1_NEGATIVE' } },
    childNode: { connect: { id: 'LEVEL_2_NEGATIVE_Facilities' } },
    conditions: { create: { conditionType: 'matchValue', matchValue: 'Facilities' } },
  },
]

interface Interaction {
  entries: Prisma.SessionCreateInput[];
}

const interactions : Prisma.SessionCreateInput[] = [
  {
    dialogue: { connect: { id: 'TEST_ID' } },
    nodeEntries: { create: [
      {
        relatedNode: { connect: { id:  'SLIDER_ROOT' } },
        sliderNodeEntry: { create: { value: 15 } },
      },
      {
        relatedNode: { connect: { id:  'LEVEL_1_NEGATIVE' } },
        choiceNodeEntry: { create: { value: 'Website' } },
      },
      {
        relatedNode: { connect: { id:  'LEVEL_2_NEGATIVE_Website' } },
        choiceNodeEntry: { create: { value: 'Design' } },
      },
    ] }
  },
  {
    dialogue: { connect: { id: 'TEST_ID' } },
    nodeEntries: { create: [
      {
        relatedNode: { connect: { id:  'SLIDER_ROOT' } },
        sliderNodeEntry: { create: { value: 20 } },
      },
      {
        relatedNode: { connect: { id:  'LEVEL_1_NEGATIVE' } },
        choiceNodeEntry: { create: { value: 'Facilities' } },
      },
      {
        relatedNode: { connect: { id:  'LEVEL_2_NEGATIVE_Facilities' } },
        choiceNodeEntry: { create: { value: 'Too few' } },
      },
    ] }
  },
  {
    dialogue: { connect: { id: 'TEST_ID' } },
    nodeEntries: { create: [
      {
        relatedNode: { connect: { id:  'SLIDER_ROOT' } },
        sliderNodeEntry: { create: { value: 80 } },
      },
      {
        relatedNode: { connect: { id:  'LEVEL_1_POSITIVE' } },
        choiceNodeEntry: { create: { value: 'Facilities' } },
      },
      {
        relatedNode: { connect: { id:  'LEVEL_2_POSITIVE_Facilities' } },
        choiceNodeEntry: { create: { value: 'Too Much' } },
      },
    ] }
  },
]

export const createTestDialogue = async (prisma: PrismaClient) => {
  const createdDialogue = await prisma.dialogue.create({
    data: {
      id: 'TEST_ID',
      title: 'Test dialogue',
      description: 'Test dialogue description',
      slug: 'test',
      customer: {
        create: {
          id: 'TEST_ID',
          name: 'Test customer',
          slug: 'test'
        }
      }
    }
  });

  const createdNodes = await Promise.all(questionNodes.map(async (node) => {
    await prisma.questionNode.create({
      data: {
        id: node.id,
        title: node.title,
        type: node.type,
        isRoot: node.isRoot,
        questionDialogue: { connect: { id: createdDialogue?.id } }
      }
    });
  }));

  const createdEdges = await Promise.all(edges.map(async (edge) => {
    await prisma.edge.create({
      data: {
        dialogue: { connect: { id: 'TEST_ID' } },
        ...edge
      }
    });
  }));

  return createdDialogue;
}

export const createFewInteractions = async(prisma: PrismaClient) => {
  const createdInteractions = await Promise.all(interactions.map(async (interaction) => {
    await prisma.session.create({
      data: interaction
    });
  }));
}
