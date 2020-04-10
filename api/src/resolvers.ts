import { forwardTo } from 'prisma-binding';
import crypto from 'crypto';
import { ServiceContainerProps } from './services/service-container';
import { QueryResolvers } from './generated/resolver-types';
import { Prisma, prisma, NodeType } from './generated/prisma-client/index';
import SessionResolver from './models/session/session-resolver';
import CustomerResolver from './models/customer/customer-resolver';
import DialogueResolver from './models/questionnaire/questionnaire-resolver';

interface ContextProps {
  db: Prisma;
  services: ServiceContainerProps;
}

interface ILeafNodeInput {
  id: string;
  nodeId?: string;
  type?: string;
  title: string;
}

interface IQuestionConditionInput {
  id?: string;
  conditionType: string;
  renderMin: number;
  renderMax: number;
  matchValue: string;
}

interface IEdgeNodeInput {
  id: string;
  title: string;
}

interface IEdgeChildInput {
  id: string;
  conditions: [IQuestionConditionInput];
  parentNode: IEdgeNodeInput;
  childNode: IEdgeNodeInput;
}

interface IOptionInput {
  id?: string;
  value: string;
  publicValue?: string;
}

interface IQuestionInput {
  id: string;
  title: string;
  isRoot: boolean;
  isLeaf: boolean;
  type: NodeType;
  overrideLeaf: ILeafNodeInput;
  options: [IOptionInput];
  children: [IEdgeChildInput];
}

const removeNonExistingEdges = async (activeEdges: Array<string>, newEdges: Array<IEdgeChildInput>, questionId: any) => {
  if (questionId) {
    const newEdgeIds = newEdges.map(({ id }) => id);
    // Remove when not in list and when not undefined (= nog niet beschikbaar in db)
    const removeEdgeChildIds = activeEdges?.filter((id) => (!newEdgeIds.includes(id) && id));
    if (removeEdgeChildIds?.length > 0) {
      await prisma.deleteManyEdges({ id_in: removeEdgeChildIds });
    }
  }
};

const removeNonExistingQOptions = async (activeOptions: Array<string>, newOptions: Array<IOptionInput>, questionId: string) => {
  if (questionId) {
    // const result = ((await prisma.questionNode({ id: questionId }).options()).map((edge) => edge.id));
    // console.log('options result: ', result);
    // console.log('Active QOptions: ', result);
    const newOptioIds = newOptions?.map(({ id }) => id);
    // Remove when not in list and when not undefined (= nog niet beschikbaar in db)
    const removeQOptionsIds = activeOptions?.filter((id) => (!newOptioIds.includes(id) && id));
    if (removeQOptionsIds?.length > 0) {
      await prisma.deleteManyQuestionOptions({ id_in: removeQOptionsIds });
    }
  }
};

const updateNewQConditions = async (edge: IEdgeChildInput) => {
  const { conditionType, renderMax, renderMin, matchValue } = edge.conditions[0];
  const condition = await prisma.upsertQuestionCondition(
    {
      where:
      {
        id: edge?.conditions?.[0]?.id ? edge?.conditions?.[0]?.id : 'nooooope',
      },
      create:
      {
        conditionType,
        renderMax,
        renderMin,
        matchValue,
      },
      update:
      {
        conditionType,
        renderMax,
        renderMin,
        matchValue,
      },
    },
  );
  return { id: condition.id };
};

const updateQuestionEdges = async (edgeChildren: Array<IEdgeChildInput>) => {
  const updatedEdges = await Promise.all(edgeChildren?.map(async (edge) => {
    // const condition = await updateNewQConditions(edge);
    const updatedEdge = await prisma.upsertEdge(
      {
        where: { id: edge.id ? edge.id : 'nooope' },
        create: {
          parentNode: {
            connect: {
              id: edge.parentNode.id,
            },
          },
          // TODO: Change back to connect: condition
          conditions: {
            create: [],
          },
          childNode: {
            connect: {
              id: edge.childNode.id,
            },
          },
        },
        update: {
          parentNode: {
            connect: {
              id: edge.parentNode.id,
            },
          },
          // TODO: Change back to connect: condition
          conditions: {
            create: [],
          },
          childNode: {
            connect: {
              id: edge.childNode.id,
            },
          },
        },
      },
    );
    return { id: updatedEdge.id };
  }));
  return updatedEdges;
};

const updateQuestionOptions = async (options: Array<IOptionInput>) => Promise.all(options?.map(async (option) => {
  const updatedQOption = await prisma.upsertQuestionOption(
    {
      where: { id: option.id ? option.id : 'noooope' },
      create: {
        value: option.value,
        publicValue: option.publicValue,
      },
      update: {
        value: option.value,
        publicValue: option.publicValue,
      },
    },
  );
  return { id: updatedQOption.id };
}));

const getCorrectLeaf = (currentOverrideLeafId: string | undefined | null, overrideLeaf: any) => {
  // console.log('Active override leafId: ', currentOverrideLeafId, 'New overrideLeaf: ', overrideLeaf);
  if (overrideLeaf?.id) {
    return {
      connect: {
        id: overrideLeaf.id,
      },
    };
  }

  if (currentOverrideLeafId && !overrideLeaf?.id) {
    return { disconnect: true };
  }

  if (!currentOverrideLeafId && !overrideLeaf?.id) {
    return null;
  }

  console.log('CANT FIND CORRECT LEAF :S');
};

const updateQuestion = async (questionnaireId: string, questionData: IQuestionInput) => {
  const {
    title,
    isRoot,
    isLeaf,
    type,
    overrideLeaf,
    children,
    options,
  } = questionData;
  const activeEdges = questionData.id
    ? ((await prisma.questionNode({ id: questionData.id }).children()).map((edge) => edge.id))
    : [];
  const activeOptions = questionData.id
    ? ((await prisma.questionNode({ id: questionData.id }).options()).map((edge) => edge.id))
    : [];
  const currentOverrideLeafId = questionData.id
    ? (await prisma.questionNode({ id: questionData.id })?.overrideLeaf())?.id
    : null;

  const leaf = getCorrectLeaf(currentOverrideLeafId, overrideLeaf);

  // Remove QuestionOptions which are not in new questionDataInput
  // (disconnect should happen automatically I think)
  try {
    await removeNonExistingQOptions(activeOptions, options, questionData.id);
  } catch (e) {
    console.log('Something went wrong removing options');
  }
  // Remove EdgeChildren which are not in new questionDataInput
  // (disconnect should happen autmatically I think)
  try {
    await removeNonExistingEdges(activeEdges, children, questionData.id);
  } catch (e) {
    console.log('something went wrong removing edges');
  }

  // // Update existing EdgeChildren
  const updatedOptionIds = await updateQuestionOptions(options);
  let updatedEdgeIds;
  if (questionData.id) {
    const updatedEdges = await Promise.all(children?.map(async (edge) => {
      const condition = await updateNewQConditions(edge);
      return prisma.upsertEdge(
        {
          where: { id: edge.id ? edge.id : 'nooope' },
          create: {
            parentNode: {
              connect: {
                id: edge.parentNode.id,
              },
            },
            conditions: {
              connect: condition,
            },
            childNode: {
              connect: {
                id: edge.childNode.id,
              },
            },
          },
          update: {
            parentNode: {
              connect: {
                id: edge.parentNode.id,
              },
            },
            conditions: {
              connect: condition,
            },
            childNode: {
              connect: {
                id: edge.childNode.id,
              },
            },
          },
        },
      );
    }));
    updatedEdges.map((edge) => edge.id);
  }

  const questionId = questionData.id;
  await prisma.updateQuestionNode({
    where: { id: questionId },
    data: {
      title,
      overrideLeaf: leaf,
      questionnaire: {
        connect: {
          id: questionnaireId,
        },
      },
      isRoot,
      isLeaf,
      type,
      options: {
        connect: updatedOptionIds,
      },
      children: {
        connect: updatedEdgeIds,
      },
    },
  });

  // if (questionData.id === 'ck8u92brt0gty0783h1ibrcbg') {
  //   console.log('new overrideLeaf? ', overrideLeaf);
  //   console.log('currentOverrideLeafId: ', currentOverrideLeafId);
  //   console.log('LEAF: ', leaf);
  //   console.log('Current question ID is: ', questionData.id);
  //   console.log('Current leaf is: ', (await prisma.questionNode({ id: questionData.id })?.overrideLeaf()));
  //   await prisma.updateQuestionNode({
  //     where: { id: questionData.id },
  //     data: {
  //       title,
  //       overrideLeaf: {
  //         disconnect: true,
  //       },
  //       questionnaire: {
  //         connect: {
  //           id: questionnaireId,
  //         },
  //       },
  //       isRoot,
  //       isLeaf,
  //       type,
  //       options: {
  //         connect: updatedOptionIds,
  //       },
  //       children: {
  //         connect: updatedEdgeIds,
  //       },
  //     },
  //   });
  // }
};

const createQuestion = async (questionnaireId: string, questionData: IQuestionInput) => {
  const {
    title,
    isRoot,
    type,
    overrideLeaf,
    children,
    options,
  } = questionData;

  const leaf = overrideLeaf?.id ? {
    connect: {
      id: overrideLeaf.id,
    },
  } : null;

  const updatedOptionIds = await updateQuestionOptions(options);

  const question = await prisma.createQuestionNode({
    title,
    overrideLeaf: leaf,
    questionnaire: {
      connect: {
        id: questionnaireId,
      },
    },
    isRoot,
    type,
    options: {
      connect: updatedOptionIds,
    },
    children: {
      create: [],
    },
  });

  const updatedEdges = await Promise.all(children?.map(async (edge) => {
    const condition = await updateNewQConditions(edge);
    return prisma.createEdge(
      {
        parentNode: {
          connect: {
            id: question.id,
          },
        },
        conditions: {
          connect: condition,
        },
        childNode: {
          connect: {
            id: edge.childNode.id,
          },
        },
      },
    );
  }));

  const updatedEdgeIds = updatedEdges.map((edge) => ({ id: edge.id }));

  await prisma.updateQuestionNode({
    where: { id: question.id },
    data: {
      children: {
        connect: updatedEdgeIds,
      },
    },
  });
};

const handleQuestion = async (questionnaireId: string, question: IQuestionInput) => {
  // Case #1: question ID is undefined -> Create a new question with current data
  if (!question.id) {
    return createQuestion(questionnaireId, question);
  }

  // Case #2: question ID already exists -> Update question with new data
  return updateQuestion(questionnaireId, question);
};

const updateTopicBuilder = async (parent: any, args: any) => {
  const questionnaireId: string = args.id || undefined;
  const { questions }: { questions: Array<IQuestionInput> } = args.topicData;
  await Promise.all(questions.map((question) => handleQuestion(questionnaireId, question)));

  return 'Succesfully updated topic(?)';
};

const queryResolvers: QueryResolvers<ContextProps> = {
  questionNode: forwardTo('db'),
  questionNodes: forwardTo('db'),
  questionnaire: forwardTo('db'),
  questionnaires: forwardTo('db'),
  customers: forwardTo('db'),
  edges: forwardTo('db'),
  nodeEntryValues: forwardTo('db'),
  nodeEntries: forwardTo('db'),
  sessions: forwardTo('db'),
  session: forwardTo('db'),
  // TODO: Rename
  getQuestionnaireData: DialogueResolver.getQuestionnaireAggregatedData,
  nodeEntry: forwardTo('db'),
  newSessionId: () => crypto.randomBytes(16).toString('base64'),
};

const mutationResolvers = {
  uploadUserSession: SessionResolver.uploadUserSession,
  createNewCustomer: CustomerResolver.createNewCustomerMutation,
  deleteFullCustomer: CustomerResolver.deleteFullCustomerNode,
  createNewQuestionnaire: DialogueResolver.createNewQuestionnaire,
  updateTopicBuilder,
  deleteQuestionnaire: forwardTo('db'),
  deleteCustomer: forwardTo('db'),
};

const resolvers = {
  Query: {
    ...queryResolvers,
  },
  Mutation: {
    ...mutationResolvers,
  },
  Node: {
    __resolveType(obj: any) {
      return obj.__typename;
    },
  },
};

export default resolvers;
