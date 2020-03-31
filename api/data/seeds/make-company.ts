/* eslint-disable max-len */
import { prisma, NodeType, Questionnaire, QuestionNode } from '../../src/generated/prisma-client/index';
import { leafNodes, sliderType, websiteOptions, standardOptions, productServicesOptions, customerSupportOptions, facilityOptions } from './default-data';
import { Customer } from '../../src/generated/resolver-types';

interface LeafNodeDataEntryProps {
  title: string;
  type: NodeType;
}

export const createTemplateLeafNodes = async (
  leafNodesArray: Array<LeafNodeDataEntryProps>,
) => {
  const leafs = await Promise.all(
    leafNodesArray.map(async (leafNode) => prisma.createQuestionNode({
      title: leafNode.title,
      type: leafNode.type,
    })),
  );

  return leafs;
};

export const getCorrectLeaf = (leafs: QuestionNode[], titleSubset: string) => {
  const correctLeaf = leafs.find((leaf) => leaf.title.includes(titleSubset));
  return correctLeaf?.id;
};

export const createNodesAndEdges = async (
  questionnaireId: string,
  customerName: string,
  leafs: QuestionNode[],
) => {
  // Root question (How do you feel about?)
  await prisma.createQuestionNode({
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
  await prisma.createQuestionNode({
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
      create: [...standardOptions],
    },
  });

  // Positive Sub sub child 1 (Facilities)
  await prisma.createQuestionNode({
    title: 'What exactly did you like about the facilities?',
    questionnaire: {
      connect: {
        id: questionnaireId,
      },
    },
    overrideLeaf: {
      connect: {
        id: getCorrectLeaf(
          leafs,
          'Come and join us on 1st April for our great event',
        ),
      },
    },
    type: 'MULTI_CHOICE',
    options: {
      create: [...facilityOptions],
    },
  });

  // Positive Sub sub child 2 (Website)
  await prisma.createQuestionNode({
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
      create: [...websiteOptions],
    },
  });

  // Positive Sub sub child 3 (Product/Services)
  await prisma.createQuestionNode({
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
      create: [...productServicesOptions],
    },
  });

  // Neutral Sub child 2
  await prisma.createQuestionNode({
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
      create: [...standardOptions],
    },
  });

  // Neutral Sub sub child 2 (Website)
  await prisma.createQuestionNode({
    title: 'Please specify.',
    questionnaire: {
      connect: {
        id: questionnaireId,
      },
    },
    type: 'MULTI_CHOICE',
    options: {
      create: [...websiteOptions],
    },
  });

  // Neutral Sub sub child 3 (Product/Services)
  await prisma.createQuestionNode({
    title: 'Please specify.',
    questionnaire: {
      connect: {
        id: questionnaireId,
      },
    },
    type: 'MULTI_CHOICE',
    options: {
      create: [...productServicesOptions],
    },
  });

  // Neutral Sub sub child 4 (Customer Support)
  await prisma.createQuestionNode(
    {
      title: 'Please specify.',
      questionnaire: {
        connect: {
          id: questionnaireId,
        },
      },
      type: 'MULTI_CHOICE',
      options: {
        create: [...customerSupportOptions],
      },
    },
  );

  // Negative Sub child 3
  await prisma.createQuestionNode({
    title: 'We are sorry to hear that! Where can we improve?',
    questionnaire: {
      connect: {
        id: questionnaireId,
      },
    },
    type: 'MULTI_CHOICE',
    options: {
      create: [...standardOptions],
    },
  });

  // Negative Sub sub child 1 (Facilities)
  await prisma.createQuestionNode({
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
      create: [...facilityOptions],
    },
  });

  // Negative Sub sub child 2 (Website)
  await prisma.createQuestionNode({
    title: 'Please elaborate.',
    questionnaire: {
      connect: {
        id: questionnaireId,
      },
    },
    overrideLeaf: {
      connect: {
        id: getCorrectLeaf(
          leafs,
          'Please click on the Whatsapp link below so our service',
        ),
      },
    },
    type: 'MULTI_CHOICE',
    options: {
      create: [...websiteOptions],
    },
  });

  // Negative Sub sub child 3 (Product/Services)
  await prisma.createQuestionNode({
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
      create: [...productServicesOptions],
    },
  });

  // Negative Sub sub child 4 (Customer Support)
  await prisma.createQuestionNode(
    {
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
        create: [...customerSupportOptions],
      },
    },
  );
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

export const createQuestionnaire = async (customer: Customer) => {
  const leafs = await createTemplateLeafNodes(leafNodes);
  console.log('leafs[0]', leafs[0]);

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
