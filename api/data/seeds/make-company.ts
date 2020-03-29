import { prisma, NodeType, LeafNode, Questionnaire } from '../../src/generated/prisma-client/index';
import { leafNodes, sliderType } from './seedDataStructure';
import { Customer } from '../../src/generated/resolver-types';

interface LeafNodeDataEntryProps {
  title: string;
  type?: NodeType;
}

const standardOptions = [{ value: 'Facilities' }, { value: 'Website/Mobile app' }, { value: 'Product/Services' }, { value: 'Customer Support' }];
const facilityOptions = [{ value: 'Cleanliness' }, { value: 'Atmosphere' }, { value: 'Location' }, { value: 'Other' }];
const websiteOptions = [{ value: 'Design' }, { value: 'Functionality' }, { value: 'Informative' }, { value: 'Other' }];
const customerSupportOptions = [{ value: 'Friendliness' }, { value: 'Competence' }, { value: 'Speed' }, { value: 'Other' }];
const productServicesOptions = [{ value: 'Quality' }, { value: 'Price' }, { value: 'Friendliness' }, { value: 'Other' }];

export const createTemplateLeafNodes = async (leafNodesArray: Array<LeafNodeDataEntryProps>) => {
  const leafs = await Promise.all(leafNodesArray.map(async (leafNode) => prisma.createLeafNode({
    title: leafNode.title,
    type: leafNode?.type,
  })));

  return leafs;
};

export const getCorrectLeaf = (leafs: LeafNode[], titleSubset: string) => {
  const correctLeaf = leafs.find((leaf) => leaf.title.includes(titleSubset));
  return correctLeaf?.id;
};

export const createNodesAndEdges = async (
  questionnaireId: string,
  customerName: string,
  leafs: LeafNode[],
) => {
  // Root question (How do you feel about?)
  const rootQuestion = await prisma.createQuestionNode({
    title: `How do you feel about ${customerName}?`,
    questionnaire: {
      connect: {
        id: questionnaireId,
      },
    },
    type: sliderType,
    isRoot: true,
  });

  // Positive Sub child 1 (What did you like?)
  const rootToWhatDidYou = await prisma.createQuestionNode({
    title: 'What did you like?',
    questionnaire: {
      connect: {
        id: questionnaireId,
      },
    },
    overrideLeaf: {
      connect: {
        id: getCorrectLeaf(leafs, 'Follow us on Instagram and stay'),
      },
    },
    type: 'MULTI_CHOICE',
    options: {
      create: [
        ...standardOptions,
      ],
    },
  });

  // Positive Sub sub child 1 (Facilities)
  const whatDidYouToFacilities = await prisma.createQuestionNode({
    title: 'What exactly did you like about the facilities?',
    questionnaire: {
      connect: {
        id: questionnaireId,
      },
    },
    overrideLeaf: {
      connect: {
        id: getCorrectLeaf(leafs, 'Come and join us on 1st April for our great event'),
      },
    },
    type: 'MULTI_CHOICE',
    options: {
      create: [
        ...facilityOptions,
      ],
    },
  });

  // Positive Sub sub child 2 (Website)
  const whatDidYouToWebsite = await prisma.createQuestionNode({
    title: 'What exactly did you like about the website?',
    questionnaire: {
      connect: {
        id: questionnaireId,
      },
    },
    overrideLeaf: {
      connect: {
        id: getCorrectLeaf(leafs, 'Follow us on Instagram and stay'),
      },
    },
    type: 'MULTI_CHOICE',
    options: {
      create: [
        ...websiteOptions,
      ],
    },
  });

  // Positive Sub sub child 3 (Product/Services)
  const whatDidYouToProduct = await prisma.createQuestionNode({
    title: 'What exactly did you like about the product / services?',
    questionnaire: {
      connect: {
        id: questionnaireId,
      },
    },
    overrideLeaf: {
      connect: {
        id: getCorrectLeaf(leafs, 'We think you might like this as'),
      },
    },
    type: 'MULTI_CHOICE',
    options: {
      create: [
        ...productServicesOptions,
      ],
    },
  });

  // Positive Sub sub child 4 (Customer Support)
  const whatDidYouToCustomerSupport = await prisma.createQuestionNode({
    title: 'What exactly did you like about the customer support?',
    questionnaire: {
      connect: {
        id: questionnaireId,
      },
    },
    overrideLeaf: {
      connect: {
        id: getCorrectLeaf(leafs, 'your email below to receive our newsletter'),
      },
    },
    type: 'MULTI_CHOICE',
    options: {
      create: [
        ...customerSupportOptions,
      ],
    },
  });

  // Neutral Sub child 2
  const rootToWhatWouldYouLikeToTalkAbout = await prisma.createQuestionNode({
    title: 'What would you like to talk about?',
    questionnaire: {
      connect: {
        id: questionnaireId,
      },
    },
    overrideLeaf: {
      connect: {
        id: getCorrectLeaf(leafs, 'Leave your email below to receive our'),
      },
    },
    type: 'MULTI_CHOICE',
    options: {
      create: [
        ...standardOptions,
      ],
    },
  });

  // Neutral Sub sub child 1 (Facilities)
  const whatWouldYouLikeToTalkAboutToFacilities = await prisma.createQuestionNode({
    title: 'Please specify.',
    questionnaire: {
      connect: {
        id: questionnaireId,
      },
    },
    type: 'MULTI_CHOICE',
    options: {
      create: [
        ...facilityOptions,
      ],
    },
  });

  // Neutral Sub sub child 2 (Website)
  const whatWouldYouLikeToTalkAboutToWebsite = await prisma.createQuestionNode({
    title: 'Please specify.',
    questionnaire: {
      connect: {
        id: questionnaireId,
      },
    },
    type: 'MULTI_CHOICE',
    options: {
      create: [
        ...websiteOptions,
      ],
    },
  });

  // Neutral Sub sub child 3 (Product/Services)
  const whatWouldYouLikeToTalkAboutToProduct = await prisma.createQuestionNode({
    title: 'Please specify.',
    questionnaire: {
      connect: {
        id: questionnaireId,
      },
    },
    type: 'MULTI_CHOICE',
    options: {
      create: [
        ...productServicesOptions,
      ],
    },
  });

  // Neutral Sub sub child 4 (Customer Support)
  const whatWouldYouLikeToTalkAboutToCustomerSupport = await prisma.createQuestionNode({
    title: 'Please specify.',
    questionnaire: {
      connect: {
        id: questionnaireId,
      },
    },
    type: 'MULTI_CHOICE',
    options: {
      create: [
        ...customerSupportOptions,
      ],
    },
  });

  // Negative Sub child 3
  const rootToWeAreSorryToHearThat = await prisma.createQuestionNode({
    title: 'We are sorry to hear that! Where can we improve?',
    questionnaire: {
      connect: {
        id: questionnaireId,
      },
    },
    type: 'MULTI_CHOICE',
    options: {
      create: [
        ...standardOptions,
      ],
    },
  });

  // Negative Sub sub child 1 (Facilities)
  const weAreSorryToHearThatToFacilities = await prisma.createQuestionNode({
    title: 'Please elaborate.',
    questionnaire: {
      connect: {
        id: questionnaireId,
      },
    },
    overrideLeaf: {
      connect: {
        id: getCorrectLeaf(leafs, 'Our team is on it'),
      },
    },
    type: 'MULTI_CHOICE',
    options: {
      create: [
        ...facilityOptions,
      ],
    },
  });

  // Negative Sub sub child 2 (Website)
  const weAreSorryToHearThatToWebsite = await prisma.createQuestionNode({
    title: 'Please elaborate.',
    questionnaire: {
      connect: {
        id: questionnaireId,
      },
    },
    overrideLeaf: {
      connect: {
        id: getCorrectLeaf(leafs, 'Please click on the Whatsapp link below so our service'),
      },
    },
    type: 'MULTI_CHOICE',
    options: {
      create: [
        ...websiteOptions,
      ],
    },
  });

  // Negative Sub sub child 3 (Product/Services)
  const weAreSorryToHearThatToProduct = await prisma.createQuestionNode({
    title: 'Please elaborate.',
    questionnaire: {
      connect: {
        id: questionnaireId,
      },
    },
    overrideLeaf: {
      connect: {
        id: getCorrectLeaf(leafs, 'Click below for your refund'),
      },
    },
    type: 'MULTI_CHOICE',
    options: {
      create: [
        ...productServicesOptions,
      ],
    },
  });

  // Negative Sub sub child 4 (Customer Support)
  const weAreSorryToHearThatToCustomerSupport = await prisma.createQuestionNode({
    title: 'Please elaborate.',
    questionnaire: {
      connect: {
        id: questionnaireId,
      },
    },
    overrideLeaf: {
      connect: {
        id: getCorrectLeaf(leafs, 'Our customer experience supervisor is'),
      },
    },
    type: 'MULTI_CHOICE',
    options: {
      create: [
        ...customerSupportOptions,
      ],
    },
  });

  // ################################### EDGES ################################
  const edgeData = [
    // POSITIVE EDGES
    {
      parent: rootQuestion,
      conditions: {
        conditionType: 'valueBoundary',
        matchValue: null,
        renderMin: 70,
        renderMax: 100,
      },
      child: rootToWhatDidYou,
    },

    {
      parent: rootToWhatDidYou,
      conditions: {
        conditionType: 'match',
        matchValue: 'Facilities',
        renderMin: null,
        renderMax: null,
      },
      child: whatDidYouToFacilities,
    },

    {
      parent: rootToWhatDidYou,
      conditions: {
        conditionType: 'match',
        matchValue: 'Website/Mobile app',
        renderMin: null,
        renderMax: null,
      },
      child: whatDidYouToWebsite,
    },

    {
      parent: rootToWhatDidYou,
      conditions: {
        conditionType: 'match',
        matchValue: 'Product/Services',
        renderMin: null,
        renderMax: null,
      },
      child: whatDidYouToProduct,
    },

    {
      parent: rootToWhatDidYou,
      conditions: {
        conditionType: 'match',
        matchValue: 'Customer Support',
        renderMin: null,
        renderMax: null,
      },
      child: whatDidYouToProduct,
    },

    // NEUTRAL EDGES
    {
      parent: rootQuestion,
      conditions: {
        conditionType: 'valueBoundary',
        matchValue: null,
        renderMin: 50,
        renderMax: 70,
      },
      child: rootToWhatWouldYouLikeToTalkAbout,
    },

    {
      parent: rootToWhatWouldYouLikeToTalkAbout,
      conditions: {
        conditionType: 'match',
        matchValue: 'Facilities',
        renderMin: null,
        renderMax: null,
      },
      child: whatDidYouToFacilities,
    },

    {
      parent: rootToWhatWouldYouLikeToTalkAbout,
      conditions: {
        conditionType: 'match',
        matchValue: 'Website/Mobile app',
        renderMin: null,
        renderMax: null,
      },
      child: whatWouldYouLikeToTalkAboutToWebsite,
    },

    {
      parent: rootToWhatWouldYouLikeToTalkAbout,
      conditions: {
        conditionType: 'match',
        matchValue: 'Product/Services',
        renderMin: null,
        renderMax: null,
      },
      child: whatWouldYouLikeToTalkAboutToProduct,
    },

    {
      parent: rootToWhatWouldYouLikeToTalkAbout,
      conditions: {
        conditionType: 'match',
        matchValue: 'Customer Support',
        renderMin: null,
        renderMax: null,
      },
      child: whatWouldYouLikeToTalkAboutToCustomerSupport,
    },

    // NEGATIVE EDGES
    {
      parent: rootQuestion,
      conditions: {
        conditionType: 'valueBoundary',
        matchValue: null,
        renderMin: 0,
        renderMax: 50,
      },
      child: rootToWeAreSorryToHearThat,
    },

    {
      parent: rootToWeAreSorryToHearThat,
      conditions: {
        conditionType: 'match',
        matchValue: 'Facilities',
        renderMin: null,
        renderMax: null,
      },
      child: weAreSorryToHearThatToFacilities,
    },

    {
      parent: rootToWeAreSorryToHearThat,
      conditions: {
        conditionType: 'match',
        matchValue: 'Website/Mobile app',
        renderMin: null,
        renderMax: null,
      },
      child: weAreSorryToHearThatToWebsite,
    },

    {
      parent: rootToWeAreSorryToHearThat,
      conditions: {
        conditionType: 'match',
        matchValue: 'Product/Services',
        renderMin: null,
        renderMax: null,
      },
      child: weAreSorryToHearThatToProduct,
    },

    {
      parent: rootToWeAreSorryToHearThat,
      conditions: {
        conditionType: 'match',
        matchValue: 'Customer Support',
        renderMin: null,
        renderMax: null,
      },
      child: weAreSorryToHearThatToCustomerSupport,
    },

  ];
  // Root to 'What did you like'
  const edges = await Promise.all(edgeData.map(async (edge) => {
    const edgeEntry = await prisma.createEdge({
      parentNode: {
        connect: {
          id: edge.parent.id,
        },
      },
      conditions: {
        create: [edge.conditions],
      },
      childNode: {
        connect: {
          id: edge.child.id,
        },
      },
    });

    await prisma.updateQuestionNode({
      where: {
        id: edge.parent.id,
      },
      data: {
        edgeChildren: {
          connect: [{ id: edgeEntry.id }],
        },
      },
    });
  }));
};

export const seedQuestionnare = async (
  customerId: string,
  customerName: string,
  questionnaireTitle: string = 'Default questionnaire',
  questionnaireDescription: string = 'Default questions',
): Promise<Questionnaire> => {
  const leafs = await createTemplateLeafNodes(leafNodes);

  const questionnaire = await prisma.createQuestionnaire({
    customer: {
      connect: {
        id: customerId,
      },
    },
    leafs: {
      connect: leafs.map((leaf) => ({ id: leaf.id })),
    },
    title: questionnaireTitle,
    description: questionnaireDescription,
    questions: {
      create: [],
    },
  });

  await createNodesAndEdges(questionnaire.id, customerName, leafs);
  return questionnaire;
};

export const seedFreshCompany = async (customer: Customer) => {
  const leafs = await createTemplateLeafNodes(leafNodes);

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
      create: [],
    },
  });

  await createNodesAndEdges(questionnaire.id, customer.name, leafs);
};
