import { prisma, NodeType } from '../../src/generated/prisma-client/index';

const CUSTOMER = 'Starbucks';

const multiChoiceType: NodeType = 'MULTI_CHOICE';
const socialShareType: NodeType = 'SOCIAL_SHARE';
const sliderType: NodeType = 'SLIDER';
const textboxType: NodeType = 'TEXTBOX';
const registrationType: NodeType = 'REGISTRATION';

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
    conditions: {
      renderMin: 7,
      renderMax: 10,
    },
    options: standardSubChildren.map((child) => child.relatedOptionValue),
    children: standardSubChildren,
  },
  {
    title: 'What would you like to talk about?',
    questionType: multiChoiceType,
    conditions: {
      renderMin: 5,
      renderMax: 7,
    },
    options: standardSubChildren.map((child) => child.relatedOptionValue),
    children: standardSubChildren,
  },
  {
    title: 'We are sorry to hear that! Where can we improve?',
    conditions: {
      renderMin: 0,
      renderMax: 5,
    },
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

const makeStarbucks = async () => {
  const customer = await prisma.createCustomer({
    name: CUSTOMER,
    settings: {
      create: {
        logoUrl: 'https://www.stickpng.com/assets/images/58428cc1a6515b1e0ad75ab1.png',
        colourSettings: {
          create: {
            primary: '#007143',
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
      create: {
        title: `How do you feel about ${customer.name}?`,
        questionType: sliderType,
        isRoot: true,
      },
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
    const leafs = await prisma.leafNodes({
      where: {
        title_contains: rootChild.overrideLeafContains,
      },
    });

    let leaf = null;

    if (leafs) {
      [leaf] = leafs;
    }

    return {
      ...rootChild,
      overrideLeaf: leaf,
    };
  }));

  const standardRootChildrenWithLeafs = await Promise.all(standardRootChildren.map(async (rootChild) => {
    const leafs = await prisma.leafNodes({
      where: {
        title_contains: rootChild.overrideLeafContains,
      },
    });

    let leaf = null;

    if (leafs) {
      [leaf] = leafs;
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
    questionType: childNode.questionType,
    overrideLeaf: {
      connect: {
        id: childNode.overrideLeaf?.id,
      },
    },
    conditions: {
      create: {
        conditionType: 'valueBoundary',
        renderMax: childNode.conditions.renderMax,
        renderMin: childNode.conditions.renderMin,
      },
    },
    options: {
      create: childNode.options.map((option) => ({ value: option })),
    },
    children: {
      create: childNode.children.map((child) => ({
        title: child.title,
        questionType: child.type,
        overrideLeaf: {
          connect: {
            id: child.overrideLeaf?.id,
          },
        },
        conditions: {
          create: {
            conditionType: 'match',
            matchValue: child.relatedOptionValue,
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
    },
  });
  const mainQuestion = mainQuestions[0];

  // Connect the root question to the other questions
  await prisma.updateQuestionNode({
    where: {
      id: mainQuestion.id,
    },
    data: {
      children: {
        connect: rootQuestions.map((rootNode) => ({ id: rootNode.id })),
      },
    },
  });
};

export default makeStarbucks;
