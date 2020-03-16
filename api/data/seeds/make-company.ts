import { prisma, NodeType,
  QuestionNode, LeafNode, Questionnaire, Maybe, ID_Input } from '../../src/generated/prisma-client/index';
import { leafNodes, sliderType, standardRootChildren,
  getStandardEdgeData, standardSubChildren } from './seedDataStructure';
import { Customer } from '../../src/generated/resolver-types';

interface LeafNodeDataEntryProps {
  title: string;
  type?: NodeType;
}

interface LeafNodeChildrenProps {
  value: string;
  type: NodeType
}

interface standardSubChildrenEntry {
  title: string;
  overrideLeafContains?: string;
  type: NodeType;
  relatedOptionValue: string;
  childrenNodes: Array<LeafNodeChildrenProps>;
}

interface StandardRootChildWithLeafsProps {
  overrideLeaf: LeafNode | null;
  children: any;
  title: string;
  questionType: NodeType;
  overrideLeafContains?: string | undefined;
  options: string[];
}
interface StandardRootChildEntryProps {
  title: string;
  questionType: NodeType;
  overrideLeaf?: LeafNode;
  overrideLeafContains?: string;
  options: Array<string>;
  children: any;
}

export const createTemplateLeafNodes = async (leafNodesArray: Array<LeafNodeDataEntryProps>) => {
  const leafs = await Promise.all(leafNodesArray.map(async (leafNode) => prisma.createLeafNode({
    title: leafNode.title,
    type: leafNode?.type,
  })));

  return leafs;
};

export const createStandardSubChildrenWithLeaves = async (
  questionnaireId: string,
  standardSubChildrenArray: Array<standardSubChildrenEntry>,
) => {
  const standardSubChildrenWithLeafs = await Promise.all(
    standardSubChildrenArray.map(async (rootChild) => {
      const subleafs = await prisma.leafNodes({
        where: {
          title_contains: rootChild.overrideLeafContains,
          AND: {
            id_in: await Promise.all((await
            prisma.questionnaire({ id: questionnaireId }).leafs()).map((leaf) => leaf.id)),
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
  const standardRootChildrenWithLeafs = await Promise.all(standardRootChildrenArray
    .map(async (rootChild) => {
      const subleafs = await prisma.leafNodes({
        where: {
          title_contains: rootChild.overrideLeafContains,
          AND: {
            id_in: await Promise.all((await prisma.questionnaire({ id: questionnaireId })
              .leafs()).map((leaf) => leaf.id)),
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

  return standardRootChildrenWithLeafs;
};

export const createQuestionsForQuestionnaire = async (questionnaireId: string) => {
  const standardSubChildrenWithLeafs = await createStandardSubChildrenWithLeaves(questionnaireId,
    standardSubChildren);

  const standardRootChildrenWithLeafs: Array<StandardRootChildWithLeafsProps> = await
  createStandardRootChildrenWithLeaves(
    questionnaireId, standardRootChildren, standardSubChildrenWithLeafs,
  );

  // Create root-questions
  const rootQuestions = await Promise.all(standardRootChildrenWithLeafs
    .map(async (childNode) => prisma.createQuestionNode({
      title: childNode.title,
      questionnaire: {
        connect: {
          id: questionnaireId,
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
        create: childNode.children.map((child: any) => ({
          title: child.title,
          questionnaire: {
            connect: {
              id: questionnaireId,
            },
          },
          questionType: child?.type,
          overrideLeaf: {
            connect: {
              id: child?.overrideLeaf?.id,
            },
          },
          options: {
            create: child.childrenNodes.map((subChild: any) => ({ value: subChild.value })),
          },
        })),
      },
    })));

  return rootQuestions;
};

export const getRootQuestionOfQuestionnaire = async (questionnaireId: string) => {
  // Extract mainQuestion
  // TODO: How to get unique boolean isRoot, so that we can use prisma.questionNode
  const mainQuestions = await prisma.questionNodes({
    where: {
      isRoot: true,
      AND: {
        id_in: await Promise.all((await prisma.questionnaire({ id: questionnaireId })
          .questions()).map((q) => q.id)),
      },
    },
  });
  const mainQuestion = mainQuestions[0];
  return mainQuestion;
};

export const connectQuestionsToQuestionnaire = async (questionnaireId: string,
  mainQuestion: QuestionNode, rootQuestions: QuestionNode[]) => {
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
        connect: rootQuestions.map((rootNode: QuestionNode) => ({ id: rootNode.id })),
      },
    },
  });
};

const standardOptions = [{ value: 'Facilities' }, { value: 'Website/Mobile app' }, { value: 'Product/Services' }, { value: 'Customer support' }];
const facilityOptions = [{ value: 'Cleanliness' }, { value: 'Atmosphere' }, { value: 'Location' }, { value: 'Other' }];
const websiteOptions = [{ value: 'Design' }, { value: 'Functionality' }, { value: 'Informative' }, { value: 'Other' }];
const customerSupportOptions = [{ value: 'Friendliness' }, { value: 'Competence' }, { value: 'Speed' }, { value: 'Other' }];
const productServicesOptions = [{ value: 'Quality' }, { value: 'Price' }, { value: 'Friendliness' }, { value: 'Other' }];

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
    questionType: sliderType,
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
    questionType: 'MULTI_CHOICE',
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
    questionType: 'MULTI_CHOICE',
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
    questionType: 'MULTI_CHOICE',
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
    questionType: 'MULTI_CHOICE',
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
    questionType: 'MULTI_CHOICE',
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
    questionType: 'MULTI_CHOICE',
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
    questionType: 'MULTI_CHOICE',
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
    questionType: 'MULTI_CHOICE',
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
    questionType: 'MULTI_CHOICE',
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
    questionType: 'MULTI_CHOICE',
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
    questionType: 'MULTI_CHOICE',
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
    questionType: 'MULTI_CHOICE',
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
    questionType: 'MULTI_CHOICE',
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
    questionType: 'MULTI_CHOICE',
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
    questionType: 'MULTI_CHOICE',
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

export const seedQuestions = async (questionnaireId: string) => {
  const rootQuestions = await createQuestionsForQuestionnaire(questionnaireId);
  const mainQuestion = await getRootQuestionOfQuestionnaire(questionnaireId);

  await connectQuestionsToQuestionnaire(questionnaireId, mainQuestion, rootQuestions);
};

export const createEdges = async (
  questionnaireId: string,
  customerName: string,
  leafs: LeafNode[],
) => {
  const leafIds = leafs.map((leaf) => leaf.id);
  const edges = getStandardEdgeData(customerName);

  // Create edges here
  await Promise.all(edges.map(async (edge) => {
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

    const parentNode = await prisma.questionNodes(
      {
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
      },
    );

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
  }));
};

export const connectEdgesToQuestionnaire = async (questionnaireId: string) => {
  await Promise.all((await prisma.questionNodes({ where:
    { questionnaire: { id: questionnaireId } } })).map(async (node) => {
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
        edgeChildren: {
          connect: edgeChildrenNodes.map((edgeChild) => ({ id: edgeChild.id })),
        },
      },
    });
  }));
};

export const seedEdges = async (customerName: string,
  questionnaireId: string, leafs: LeafNode[]) => {
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

const seedQuestionnareOfCustomer = async (customer: Customer): Promise<Questionnaire> => {
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
      create: [{
        title: `How do you feel about ${customer.name}?`,
        questionType: sliderType,
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
