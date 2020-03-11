import { prisma, NodeType } from '../../src/generated/prisma-client/index';

const CUSTOMER = 'Mediamarkt';

const multiChoiceType: NodeType = 'MULTI_CHOICE';
const socialShareType: NodeType = 'SOCIAL_SHARE';
const sliderType: NodeType = 'SLIDER';
const textboxType: NodeType = 'TEXTBOX';
const registrationType: NodeType = 'REGISTRATION';

const standardEdges = [
  {
    parentQuestionContains: `How do you feel about ${CUSTOMER}`, // hardcode company name?
    childQuestionContains: 'What did you like?',
    conditions: [
      {
        conditionType: 'valueBoundary',
        renderMin: 7,
        renderMax: 10,
        matchValue: null,
      },
    ],
  },

  {
    parentQuestionContains: 'What did you like?',
    childQuestionContains: 'What exactly did you like about facilities?',
    conditions: [
      {
        conditionType: 'match',
        matchValue: 'Facilities',
        renderMin: null,
        renderMax: null,
      },
    ],
  },

  {
    parentQuestionContains: 'What did you like?',
    childQuestionContains: 'What exactly did you like about the website',
    conditions: [
      {
        conditionType: 'match',
        matchValue: 'Website/Mobile app',
        renderMin: null,
        renderMax: null,
      },
    ],
  },

  {
    parentQuestionContains: 'What did you like?',
    childQuestionContains: 'What exactly did you like about the product?',
    conditions: [
      {
        conditionType: 'match',
        matchValue: 'Product / Services',
        renderMin: null,
        renderMax: null,
      },
    ],
  },

  {
    parentQuestionContains: 'What did you like?',
    childQuestionContains: 'What exactly did you like about the customer support?',
    conditions: [
      {
        conditionType: 'match',
        matchValue: 'Customer Support',
        renderMin: null,
        renderMax: null,
      },
    ],
  },

  {
    parentQuestionContains: `How do you feel about ${CUSTOMER}`,
    childQuestionContains: 'What would you like to talk about?',
    conditions: [
      {
        conditionType: 'valueBoundary',
        renderMin: 5,
        renderMax: 7,
        matchValue: null,
      },
    ],
  },

  {
    parentQuestionContains: 'What would you like to talk about?',
    childQuestionContains: 'What exactly did you like about facilities?',
    conditions: [
      {
        conditionType: 'match',
        matchValue: 'Facilities',
        renderMin: null,
        renderMax: null,
      },
    ],
  },

  {
    parentQuestionContains: 'What would you like to talk about?',
    childQuestionContains: 'What exactly did you like about the website',
    conditions: [
      {
        conditionType: 'match',
        matchValue: 'Website/Mobile app',
        renderMin: null,
        renderMax: null,
      },
    ],
  },

  {
    parentQuestionContains: 'What would you like to talk about?',
    childQuestionContains: 'What exactly did you like about the product?',
    conditions: [
      {
        conditionType: 'match',
        matchValue: 'Product / Services',
        renderMin: null,
        renderMax: null,
      },
    ],
  },

  {
    parentQuestionContains: 'What would you like to talk about?',
    childQuestionContains: 'What exactly did you like about the customer support?',
    conditions: [
      {
        conditionType: 'match',
        matchValue: 'Customer Support',
        renderMin: null,
        renderMax: null,
      },
    ],
  },

  {
    parentQuestionContains: `How do you feel about ${CUSTOMER}`,
    childQuestionContains: 'We are sorry to hear that',
    conditions: [
      {
        conditionType: 'valueBoundary',
        renderMin: 0,
        renderMax: 5,
        matchValue: null,
      },
    ],
  },

  {
    parentQuestionContains: 'We are sorry to hear that',
    childQuestionContains: 'What exactly did you like about facilities?',
    conditions: [
      {
        conditionType: 'match',
        matchValue: 'Facilities',
        renderMin: null,
        renderMax: null,
      },
    ],
  },

  {
    parentQuestionContains: 'We are sorry to hear that',
    childQuestionContains: 'What exactly did you like about the website',
    conditions: [
      {
        conditionType: 'match',
        matchValue: 'Website/Mobile app',
        renderMin: null,
        renderMax: null,
      },
    ],
  },

  {
    parentQuestionContains: 'We are sorry to hear that',
    childQuestionContains: 'What exactly did you like about the product?',
    conditions: [
      {
        conditionType: 'match',
        matchValue: 'Product / Services',
        renderMin: null,
        renderMax: null,
      },
    ],
  },

  {
    parentQuestionContains: 'We are sorry to hear that',
    childQuestionContains: 'What exactly did you like about the customer support?',
    conditions: [
      {
        conditionType: 'match',
        matchValue: 'Customer Support',
        renderMin: null,
        renderMax: null,
      },
    ],
  },

];

const standardSubChildren = [
  {
    title: 'What exactly did you like about facilities?',
    overrideLeafContains: 'Instagram',
    type: multiChoiceType,
    relatedOptionValue: 'Facilities',
    childrenNodes: [
      { value: 'Design', type: multiChoiceType },
      { value: 'Functionality', type: multiChoiceType },
      { value: 'Informative', type: multiChoiceType },
      { value: 'Other', type: multiChoiceType },
    ],
  },
  {
    title: 'What exactly did you like about the website?',
    overrideLeafContains: 'newsletter',
    type: multiChoiceType,
    relatedOptionValue: 'Website/Mobile app',
    childrenNodes: [
      { value: 'Cleanliness', type: multiChoiceType },
      { value: 'Atmosphere', type: multiChoiceType },
      { value: 'Location', type: multiChoiceType },
      { value: 'Other', type: multiChoiceType },
    ],
  },
  {
    title: 'What exactly did you like about the product?',
    overrideLeafContains: 'see you soon',
    type: multiChoiceType,
    relatedOptionValue: 'Product / Services',
    childrenNodes: [
      { value: 'Quality', type: multiChoiceType },
      { value: 'Price', type: multiChoiceType },
      { value: 'Friendliness', type: multiChoiceType },
      { value: 'Other', type: multiChoiceType },
    ],
  },
  {
    title: 'What exactly did you like about the customer support?',
    overrideLeafContains: 'team is on it',
    type: multiChoiceType,
    relatedOptionValue: 'Customer Support',
    childrenNodes: [
      { value: 'Friendliness', type: multiChoiceType },
      { value: 'Competence', type: multiChoiceType },
      { value: 'Speed', type: multiChoiceType },
      { value: 'Options', type: multiChoiceType },
    ],
  },
];

const standardRootChildren = [
  {
    title: 'What did you like?',
    questionType: multiChoiceType,
    overrideLeafContains: 'Instagram',
    options: standardSubChildren.map((child) => child.relatedOptionValue),
    children: standardSubChildren,
  },
  {
    title: 'What would you like to talk about?',
    questionType: multiChoiceType,
    options: standardSubChildren.map((child) => child.relatedOptionValue),
    children: standardSubChildren,
  },
  {
    title: 'We are sorry to hear that! Where can we improve?',
    questionType: multiChoiceType,
    options: standardSubChildren.map((child) => child.relatedOptionValue),
    children: standardSubChildren,
  },
];

const leafNodes = [
  {
    title: 'We are happy about your positive feedback. You matter to us! Leave your email below to receive our newsletter.',
    type: textboxType,
  },
  {
    title: 'Thank you for your elaborate feedback. Kindly appreciated bruv!',
    type: socialShareType,
  },
  {
    title: 'Thank you for your feedback on our facilities. We hope to see you soon again!',
    type: socialShareType,
  },
  {
    title: 'Thank you for your feedback on our website. We hope to hear from you again!',
  },
  {
    title: 'Thank you for your positive feedback. Follow us on Instagram and stay updated.',
    type: socialShareType,
  },
  {
    title: 'Thank you for your positive feedback. Come and join us on 1st April for our great event. Leave your email address below to register.',
    type: registrationType,
  },
  {
    title: 'Thank you for your positive feedback. We think you might like this as well.',
    type: socialShareType,
  },
  {
    title: 'We are happy about your positive feedback. You matter to us! Leave your email below to receive our newsletter.',
    type: registrationType,
  },
  {
    title: 'Thank you for your feedback. You matter to us! Leave your email below to receive our newsletter.',
    type: registrationType,
  },
  {
    title: 'Thank you! Leave your email below to subscribe to our newsletter.',
    type: registrationType,
  },
  {
    title: 'Thank you for your feedback. Our customer experience supervisor is informed. Please leave your number below so we can solve the issue.',
    type: registrationType,
  },
  {
    title: 'Thank you for your feedback. You matter to us! Click below for your refund.',
  },
  {
    title: 'Thank you for your feedback. Please click on the Whatsapp link below so our service team can fix the issue.',
  },
  {
    title: 'Thank you for your feedback. Our team is on it. If you leave your email below we will keep you updated.',
    type: registrationType,
  },
  {
    title: 'Thank you! Please leave your number below so we can reach out to you with a solution.',
    type: registrationType,
  },
];

const makeMediamarkt = async () => {
  const customer = await prisma.createCustomer({
    name: CUSTOMER,
    settings: {
      create: {
        logoUrl: 'https://pbs.twimg.com/profile_images/644430670513631232/x7TWAZrV_400x400.png',
        colourSettings: {
          create: {
            primary: '#e31e24',
          },
        },
      },
    },
  });

  // Create leaf-nodes
  const leafs = await Promise.all(leafNodes.map(async (leafNode) => {
    return prisma.createLeafNode({
      title: leafNode.title,
      type: leafNode.type,
    });
  }));

  // Create questionnaire
  const questionnaire = await prisma.createQuestionnaire({
    customer: {
      connect: {
        id: customer.id,
      },
    },
    leafs: {
      connect: leafs.map((leaf) => ({ id: leaf.id })),
    },
    title: 'Default questionnaire',
    description: 'Default questions',
    questions: {
      create: [
        {
          title: `How do you feel about ${customer.name}?`,
          questionType: sliderType,
          isRoot: true,
        },
      ],
    },
  });

  // Connect the questionnaire to the customer
  prisma.updateCustomer({
    where: {
      id: customer.id,
    },
    data: {
      questionnaires: {
        connect: {
          id: questionnaire.id,
        },
      },
    },
  });

  const standardSubChildrenWithLeafs = await Promise.all(standardSubChildren.map(async (rootChild) => {
    const subleafs = await prisma.leafNodes({
      where: {
        title_contains: rootChild.overrideLeafContains,
        AND: {
          id_in: await Promise.all((await prisma.questionnaire({ id: questionnaire.id }).leafs()).map((leaf) => leaf.id)),
        },
      },
    });

    let leaf = null;

    if (subleafs) {
      [leaf] = subleafs;
    }

    return {
      ...rootChild,
      overrideLeaf: leaf,
    };
  }));

  const standardRootChildrenWithLeafs = await Promise.all(standardRootChildren.map(async (rootChild) => {
    const subleafs = await prisma.leafNodes({
      where: {
        title_contains: rootChild.overrideLeafContains,
        AND: {
          id_in: await Promise.all((await prisma.questionnaire({ id: questionnaire.id }).leafs()).map((leaf) => leaf.id)),
        },
      },
    });

    let leaf = null;

    if (subleafs) {
      [leaf] = subleafs;
    }

    return {
      ...rootChild,
      overrideLeaf: leaf,
      children: standardSubChildrenWithLeafs,
    };
  }));

  // Create root-questions
  const rootQuestions = await Promise.all(standardRootChildrenWithLeafs.map(async (childNode) => prisma.createQuestionNode({
    title: childNode.title,
    questionnaire: {
      connect: {
        id: questionnaire.id,
      },
    },
    questionType: childNode.questionType,
    overrideLeaf: {
      connect: {
        id: childNode.overrideLeaf?.id,
      },
    },
    options: {
      create: childNode.options.map((option) => ({ value: option })),
    },
    children: {
      create: childNode.children.map((child) => ({
        title: child.title,
        questionnaire: {
          connect: {
            id: questionnaire.id,
          },
        },
        questionType: child.type,
        overrideLeaf: {
          connect: {
            id: child.overrideLeaf?.id,
          },
        },
        options: {
          create: child.childrenNodes.map((subChild) => ({ value: subChild.value })),
        },
      })),
    },
  })));

  // Extract mainQuestion
  // TODO: How to get unique boolean isRoot, so that we can use prisma.questionNode
  const mainQuestions = await prisma.questionNodes({
    where: {
      isRoot: true,
      AND: {
        id_in: await Promise.all((await prisma.questionnaire({ id: questionnaire.id }).questions()).map((q) => q.id)),
      },
    },
  });
  const mainQuestion = mainQuestions[0];

  // Connect the root question to the other questions
  await prisma.updateQuestionNode({
    where: {
      id: mainQuestion.id,
    },
    data: {
      questionnaire: {
        connect: {
          id: questionnaire.id,
        },
      },
      children: {
        connect: rootQuestions.map((rootNode) => ({ id: rootNode.id })),
      },
    },
  });

  const leafIds = leafs.map((leaf) => leaf.id);
  await Promise.all(standardEdges.map(async (edge) => {
    const childNode = await prisma.questionNodes({
      where: {
        title_contains: edge.childQuestionContains,
        OR: [
          {
            overrideLeaf: {
              id_not: null,
              id_in: leafIds,
            },
          },
          {
            id: null,
          },
        ],
      },
    });

    if (!childNode[0]) {
      console.log('Cant find node for:', edge);
    }

    const childNodeId = childNode?.[0]?.id;

    const parentNode = await prisma.questionNodes(
      {
        where: {
          OR: [
            {
              title_contains: edge.parentQuestionContains,
              overrideLeaf: {
                id_not: null,
                id_in: leafIds,
              },
            },
            {
              title_contains: edge.parentQuestionContains,
              overrideLeaf: null,
            },
          ],
        },
      },
    );

    if (parentNode.length === 0) {
      console.log('Something went wrong with edge: ', edge);
    }

    const parentNodeId = parentNode?.[0]?.id;

    if (childNodeId && parentNodeId) {
      await prisma.createEdge({
        childNode: {
          connect: {
            id: childNodeId,
          },
        },
        parentNode: {
          connect: {
            id: parentNodeId,
          },
        },
        conditions: {
          create: {
            conditionType: edge.conditions?.[0].conditionType,
            matchValue: edge.conditions?.[0].matchValue,
            renderMin: edge.conditions?.[0].renderMin,
            renderMax: edge.conditions?.[0].renderMax,
          },
        },
      });
    }
  }));

  console.log(await Promise.all((await prisma.questionNodes({ where:
    { questionnaire: { id: questionnaire.id } } }))));

  await Promise.all((await prisma.questionNodes({ where:
    { questionnaire: { id: questionnaire.id } } })).map(async (node) => {

    const edgeChildrenNodes = await prisma.edges({
      where: {
        parentNode: {
          id: node.id,
        },
      },
    });

    await prisma.updateQuestionNode({
      where: {
        id: node.id,
      },
      data: {
        questionnaire: {
          connect: {
            id: questionnaire.id,
          },
        },
        edgeChildren: {
          connect: edgeChildrenNodes.map((edgeChild) => ({ id: edgeChild.id })),
        },
      },
    });
    // 1. Find all edges (parentId) corresponderend met huidige node id
    // 2. Update edgeChildren van huidige node met gevonden edges
  }));
};

export default makeMediamarkt;
