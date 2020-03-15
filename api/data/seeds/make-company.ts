import { prisma, NodeType,
  QuestionNode, LeafNode, Questionnaire } from '../../src/generated/prisma-client/index';
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
      create: [{
        title: `How do you feel about ${customerName}?`,
        questionType: sliderType,
        isRoot: true,
      },
      ],
    },
  });

  await seedQuestions(questionnaire.id);

  await seedEdges(customerName, questionnaire.id, leafs);

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
