import {
  prisma,
  NodeType,
  QuestionNode,
  Questionnaire,
} from '../../src/generated/prisma-client/index';
import {
  leafNodes,
  sliderType,
  standardRootChildren,
  getStandardEdgeData,
  standardSubChildren,
} from './seedDataStructure';
import { Customer } from '../../src/generated/resolver-types';

interface LeafNodeDataEntryProps {
  title: string;
  type: NodeType;
}

interface LeafNodeChildrenProps {
  value: string;
  type: NodeType;
}

interface standardSubChildrenEntry {
  title: string;
  overrideLeafContains?: string;
  type: NodeType;
  relatedOptionValue: string;
  childrenNodes: Array<LeafNodeChildrenProps>;
}

interface StandardRootChildWithLeafsProps {
  overrideLeaf: QuestionNode | null;
  children: any;
  title: string;
  type: NodeType;
  overrideLeafContains?: string | undefined;
  options: string[];
}
interface StandardRootChildEntryProps {
  title: string;
  type: NodeType;
  overrideLeaf?: QuestionNode;
  overrideLeafContains?: string;
  options: Array<string>;
  children: any;
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

export const createStandardSubChildrenWithLeaves = async (
  questionnaireId: string,
  standardSubChildrenArray: Array<standardSubChildrenEntry>,
) => {
  const standardSubChildrenWithLeafs = await Promise.all(
    standardSubChildrenArray.map(async (rootChild) => {
      const subleafs = await prisma.questionNodes({
        where: {
          title_contains: rootChild.overrideLeafContains,
          AND: {
            id_in: await Promise.all(
              (await prisma.questionnaire({ id: questionnaireId }).leafs()).map(
                (leaf) => leaf.id,
              ),
            ),
            AND: {
              isLeaf: true,
            },
          },
        },
      });

      if (subleafs.length > 1) {
        console.log('Sub leafs length: ', subleafs.length);
        console.log('SUB LEAFS: ', subleafs);
      }

      let leaf = null;

      if (subleafs) {
        [leaf] = subleafs;
      }

      return {
        ...rootChild,
        overrideLeaf: leaf,
      };
    }),
  );

  return standardSubChildrenWithLeafs;
};

export const createStandardRootChildrenWithLeaves = async (
  questionnaireId: string,
  standardRootChildrenArray: Array<StandardRootChildEntryProps>,
  standardSubChildrenWithLeafs: any,
) => {
  const standardRootChildrenWithLeafs = await Promise.all(
    standardRootChildrenArray.map(async (rootChild) => {
      const subleafs = await prisma.questionNodes({
        where: {
          title_contains: rootChild.overrideLeafContains,
          AND: {
            id_in: await Promise.all(
              (await prisma.questionnaire({ id: questionnaireId }).leafs()).map(
                (leaf) => leaf.id,
              ),
            ),
            AND: {
              isLeaf: true,
            },
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
    }),
  );

  return standardRootChildrenWithLeafs;
};

export const createQuestionsForQuestionnaire = async (
  questionnaireId: string,
) => {
  const standardSubChildrenWithLeafs = await createStandardSubChildrenWithLeaves(
    questionnaireId,
    standardSubChildren,
  );

  const standardRootChildrenWithLeafs:
  Array<StandardRootChildWithLeafsProps> = await createStandardRootChildrenWithLeaves(
    questionnaireId,
    standardRootChildren,
    standardSubChildrenWithLeafs,
  );

  // Create root-questions
  const rootQuestions = await Promise.all(
    standardRootChildrenWithLeafs.map(async (childNode) => prisma.createQuestionNode({
      title: childNode.title,
      questionnaire: {
        connect: {
          id: questionnaireId,
        },
      },
      type: childNode.type,
      overrideLeaf: {
        connect: {
          id: childNode.overrideLeaf?.id,
        },
      },
      options: {
        create: childNode.options.map((option) => ({ value: option })),
      },
      children: {
        create: childNode.children.map((child: any) => ({
          title: child.title,
          questionnaire: {
            connect: {
              id: questionnaireId,
            },
          },
          type: child?.type,
          overrideLeaf: {
            connect: {
              id: child?.overrideLeaf?.id,
            },
          },
          options: {
            create: child.childrenNodes.map((subChild: any) => ({
              value: subChild.value,
            })),
          },
        })),
      },
    })),
  );

  return rootQuestions;
};

export const getRootQuestionOfQuestionnaire = async (
  questionnaireId: string,
) => {
  // Extract mainQuestion
  // TODO: How to get unique boolean isRoot, so that we can use prisma.questionNode
  const mainQuestions = await prisma.questionNodes({
    where: {
      isRoot: true,
      AND: {
        id_in: await Promise.all(
          (await prisma.questionnaire({ id: questionnaireId }).questions()).map(
            (q) => q.id,
          ),
        ),
      },
    },
  });
  const mainQuestion = mainQuestions[0];
  return mainQuestion;
};

export const connectQuestionsToQuestionnaire = async (
  questionnaireId: string,
  mainQuestion: QuestionNode,
  rootQuestions: QuestionNode[],
) => {
  await prisma.updateQuestionNode({
    where: {
      id: mainQuestion.id,
    },
    data: {
      questionnaire: {
        connect: {
          id: questionnaireId,
        },
      },
      children: {
        connect: rootQuestions.map((rootNode: QuestionNode) => ({
          id: rootNode.id,
        })),
      },
    },
  });
};

const standardOptions = [
  { value: 'Facilities' },
  { value: 'Website/Mobile app' },
  { value: 'Product/Services' },
  { value: 'Customer support' },
];
const facilityOptions = [
  { value: 'Cleanliness' },
  { value: 'Atmosphere' },
  { value: 'Location' },
  { value: 'Other' },
];
const websiteOptions = [
  { value: 'Design' },
  { value: 'Functionality' },
  { value: 'Informative' },
  { value: 'Other' },
];
const customerSupportOptions = [
  { value: 'Friendliness' },
  { value: 'Competence' },
  { value: 'Speed' },
  { value: 'Other' },
];
const productServicesOptions = [
  { value: 'Quality' },
  { value: 'Price' },
  { value: 'Friendliness' },
  { value: 'Other' },
];

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

export const seedQuestions = async (questionnaireId: string) => {
  const rootQuestions = await createQuestionsForQuestionnaire(questionnaireId);
  const mainQuestion = await getRootQuestionOfQuestionnaire(questionnaireId);

  await connectQuestionsToQuestionnaire(
    questionnaireId,
    mainQuestion,
    rootQuestions,
  );
};

export const createEdges = async (
  questionnaireId: string,
  customerName: string,
  leafs: QuestionNode[],
) => {
  const leafIds = leafs.map((leaf) => leaf.id);
  const edges = getStandardEdgeData(customerName);

  // Create edges here
  await Promise.all(
    edges.map(async (edge) => {
      const childNode = await prisma.questionNodes({
        where: {
          OR: [
            {
              title_contains: edge.childQuestionContains,
              questionnaire: {
                id: questionnaireId,
              },
              overrideLeaf: {
                id_not: null,
                id_in: leafIds,
              },
            },
            {
              title_contains: edge.childQuestionContains,
              questionnaire: {
                id: questionnaireId,
              },
              id: null,
            },
          ],
        },
      });

      if (!childNode[0]) {
        console.log('Cant find node for:', edge);
      }
      const childNodeId = childNode?.[0]?.id;

      const parentNode = await prisma.questionNodes({
        where: {
          OR: [
            {
              questionnaire: {
                id: questionnaireId,
              },
              title_contains: edge.parentQuestionContains,
              overrideLeaf: {
                id_not: null,
                id_in: leafIds,
              },
            },
            {
              questionnaire: {
                id: questionnaireId,
              },
              title_contains: edge.parentQuestionContains,
              overrideLeaf: null,
            },
          ],
        },
      });

      if (!parentNode[0]) {
        console.log('Cant find node for:', edge);
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
    }),
  );
};

export const connectEdgesToQuestionnaire = async (questionnaireId: string) => {
  await Promise.all(
    (
      await prisma.questionNodes({
        where: { questionnaire: { id: questionnaireId } },
      })
    ).map(async (node) => {
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
              id: questionnaireId,
            },
          },
          children: {
            connect: edgeChildrenNodes.map((edgeChild) => ({ id: edgeChild.id })),
          },
        },
      });
    }),
  );
};

export const seedEdges = async (
  customerName: string,
  questionnaireId: string,
  leafs: QuestionNode[],
) => {
  await createEdges(questionnaireId, customerName, leafs);
  await connectEdgesToQuestionnaire(questionnaireId);
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
  // await seedQuestions(questionnaire.id);

  // await seedEdges(customerName, questionnaire.id, leafs);

  return questionnaire;
};

const seedQuestionnareOfCustomer = async (
  customer: Customer,
): Promise<Questionnaire> => {
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
      create: [
        {
          title: `How do you feel about ${customer.name}?`,
          type: sliderType,
          isRoot: true,
        },
      ],
    },
  });

  await seedQuestions(questionnaire.id);

  await seedEdges(customer.name, questionnaire.id, leafs);

  return questionnaire;
};

export const seedFreshCompany = async (customer: Customer) => {
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

const seedCompany = async (customer: Customer) => {
  const questionnaire = await seedQuestionnareOfCustomer(customer);

  // Connect the questionnaire to the customer
  const company = await prisma.updateCustomer({
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

  return company;
};

export default seedCompany;
