import { forwardTo } from "prisma-binding";
import crypto from "crypto";
import _ from "lodash";
import { QueryResolvers, MutationResolvers } from "./generated/resolver-types";
import cleanInt from "./utils/cleanInt";

import {
  prisma,
  ID_Input,
  Questionnaire,
  QuestionNode,
  NodeType
} from "./generated/prisma-client/index";
import seedCompany, {
  seedQuestionnare,
  seedFreshCompany
} from "../data/seeds/make-company";

interface ILeafNodeInput {
  id: string;
  nodeId: string;
  type: string;
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
  questionType: NodeType;
  overrideLeaf: ILeafNodeInput;
  options: [IOptionInput];
  edgeChildren: [IEdgeChildInput];
}

const deleteFullCustomerNode = async (parent: any, args: any) => {
  const { id }: { id: ID_Input } = args;
  const customerId = id;
  const customer = await prisma.deleteCustomer({ id: customerId });

  return customer;
};

const createNewCustomerMutation = async (parent: any, args: any) => {
  const { name, options } = args;
  const { isSeed, logo, primaryColour } = options;
  console.log('primary colour: ', primaryColour);
  const customer = await prisma.createCustomer({
    name,
    settings: {
      create: {
        logoUrl: logo,
        colourSettings: {
          create: {
            primary: primaryColour || '#4287f5',
          },
        },
      },
    },
    questionnaires: {
      create: [],
    },
  });

  if (isSeed) {
    await seedFreshCompany(customer);
  }

  return customer;
};

const createNewQuestionnaire = async (
  parent: any,
  args: any
): Promise<Questionnaire> => {
  const { customerId, title, description, publicTitle, isSeed } = args;
  let questionnaire = null;

  if (isSeed) {
    const customer = await prisma.customer({ id: customerId });

    if (customer?.name) {
      return seedQuestionnare(customerId, customer?.name, title, description);
    }

    console.log("Cant find customer with specified ID while seeding");
  }

  questionnaire = await prisma.createQuestionnaire({
    customer: {
      connect: {
        id: customerId
      }
    },
    leafs: {
      create: []
    },
    title,
    publicTitle,
    description,
    questions: {
      create: []
    }
  });

  return questionnaire;
};

// TODO: Put these in a 'model' file, named Questionnaire (with a Questionnaire class). Create a new instance of Questionnaire, and call .getEntries
const getQuestionnaireAggregatedData = async (parent: any, args: any) => {
  const { topicId } = args;

  const customerName = (await prisma.questionnaire({ id: topicId }).customer())
    .name;
  const questionnaire: Questionnaire | null = await prisma.questionnaire({
    id: topicId
  });

  if (questionnaire) {
    const { title, description, creationDate, updatedAt } = questionnaire;

    const questionNodes = await prisma.questionNodes({
      where: {
        questionnaire: {
          id: topicId
        }
      }
    });

    const questionNodeIds = questionNodes.map(qNode => qNode.id);

    const nodeEntries =
      (await prisma.nodeEntries({
        where: {
          relatedNode: {
            id_in: questionNodeIds
          }
        }
      })) || [];

    const aggregatedNodeEntries =
      (await Promise.all(
        nodeEntries.map(async ({ id }) => {
          const values = await prisma.nodeEntry({ id }).values();
          const nodeEntry = await prisma.nodeEntry({ id });
          const sessionId = (await prisma.nodeEntry({ id }).session()).id;

          const mappedResult = {
            sessionId,
            createdAt: nodeEntry?.creationDate,
            value: values[0].numberValue ? values[0].numberValue : -1
          };
          return mappedResult;
        })
      )) || [];

    const filterNodes =
      aggregatedNodeEntries.filter(node => {
        return node?.value !== -1;
      }) || [];

    const filteredNodeData =
      filterNodes.map(node => {
        return node?.value;
      }) || [];

    const nrEntries = filteredNodeData.reduce(
      (total = 0, previousValue) => total + previousValue,
      0
    );

    const averageSliderResult =
      (
        filteredNodeData.length > 0 && nrEntries / filteredNodeData.length
      ).toString() || "N/A";

    const orderedTimelineEntries =
      _.orderBy(
        filterNodes,
        filterNode => {
          return filterNode.createdAt;
        },
        "desc"
      ) || [];

    return {
      customerName,
      title,
      timelineEntries: orderedTimelineEntries,
      description,
      creationDate,
      updatedAt,
      average: averageSliderResult,
      totalNodeEntries: filterNodes.length
    };
  }

  // TODO: What will we return here?
  return {};
};

const removeNonExistingEdges = async (activeEdges: Array<string>, newEdges: Array<IEdgeChildInput>, questionId: any) => {
  if (questionId) {
    const newEdgeIds = newEdges.map(({ id }) => id);
    // Remove when not in list and when not undefined (= nog niet beschikbaar in db)
    const removeEdgeChildIds = activeEdges?.filter((id) => (!newEdgeIds.includes(id) && id));
    if (removeEdgeChildIds?.length > 0) {
      console.log('REMOVE EDGE CHILD IDS: ', removeEdgeChildIds);
      await prisma.deleteManyEdges({ id_in: removeEdgeChildIds });
    }
  }
};

const removeNonExistingQOptions = async (activeOptions: Array<string>, newOptions: Array<IOptionInput>, questionId: string) => {
  if (questionId) {
    const result = ((await prisma.questionNode({ id: questionId }).options()).map((edge) => edge.id));
    console.log('options result: ', result);
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
          //TODO: Change back to connect: condition
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
          //TODO: Change back to connect: condition
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

const updateQuestionOptions = async (options: Array<IOptionInput>) => {
  return Promise.all(options?.map(async (option) => {
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
};

const getCorrectLeaf = (currentOverrideLeafId: string | undefined | null, overrideLeaf: any) => {
  console.log('Active override leafId: ', currentOverrideLeafId, 'New overrideLeaf: ', overrideLeaf);
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
    questionType,
    overrideLeaf,
    edgeChildren,
    options,
  } = questionData;

  const activeEdges = questionData.id ? ((await prisma.questionNode({ id: questionData.id }).edgeChildren()).map((edge) => edge.id)) : [];
  const activeOptions = questionData.id ? ((await prisma.questionNode({ id: questionData.id }).options()).map((edge) => edge.id)) : [];
  const currentOverrideLeafId = questionData.id ? (await prisma.questionNode({ id: questionData.id })?.overrideLeaf())?.id : null;

  console.log('Current OvverideLeafId: ', currentOverrideLeafId);
  const leaf = getCorrectLeaf(currentOverrideLeafId, overrideLeaf);

  console.log('FINAL LEAF: ', leaf);
  // Remove QuestionOptions which are not in new questionDataInput (disconnect should happen automatically I think)
  try {
    await removeNonExistingQOptions(activeOptions, options, questionData.id);
  } catch (e) {
    console.log('Something went wrong removing options');
  }
  // Remove EdgeChildren which are not in new questionDataInput (disconnect should happen autmatically I think)
  try {
    await removeNonExistingEdges(activeEdges, edgeChildren, questionData.id);
  } catch (e) {
    console.log('something went wrong removing edges');
  }

  console.log('Question: ', title, 'LEAF: ', leaf, 'ID', questionData.id);

  // // Update existing EdgeChildren 
  const updatedOptionIds = await updateQuestionOptions(options);
  let updatedEdgeIds;
  if (questionData.id) {
    const updatedEdges = await Promise.all(edgeChildren?.map(async (edge) => {
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
            //TODO: Change back to connect: condition
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
            //TODO: Change back to connect: condition
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

  const questionId = questionData.id || 'noooope';
  // console.log('QUESTION ID: ', questionId);
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
      questionType,
      options: {
        connect: updatedOptionIds,
      },
      edgeChildren: {
        connect: updatedEdgeIds,
      },
    },
  });

  console.log('Succesfully updated question node');
};

const createQuestion = async (questionnaireId: string, questionData: IQuestionInput) => {
  const {
    title,
    isRoot,
    questionType,
    overrideLeaf,
    edgeChildren,
    options,
  } = questionData;

  const currentOverrideLeafId = questionData.id ? (await prisma.questionNode({ id: questionData.id })?.overrideLeaf())?.id : null;

  const leaf = getCorrectLeaf(currentOverrideLeafId, overrideLeaf);
  const leaf2 = overrideLeaf?.id ? {
    connect: {
      id: overrideLeaf.id,
    },
  } : null;

  const updatedOptionIds = await updateQuestionOptions(options);

  const question = await prisma.createQuestionNode({
    title,
    overrideLeaf: leaf2,
    questionnaire: {
      connect: {
        id: questionnaireId,
      },
    },
    isRoot,
    questionType,
    options: {
      connect: updatedOptionIds,
    },
    edgeChildren: {
      create: [],
    },
  });

  const updatedEdges = await Promise.all(edgeChildren?.map(async (edge) => {
    const condition = await updateNewQConditions(edge);
    return prisma.createEdge(
      {
        parentNode: {
          connect: {
            id: question.id,
          },
        },
        //TODO: Change back to connect: condition
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

  await prisma.updateQuestionNode({ where: { id: question.id },
    data:{
      edgeChildren: {
        connect: updatedEdgeIds,
      },
    } });

  console.log('Succesfully updated question node');
};

const handleQuestion = async (questionnaireId: string, question: IQuestionInput) => {
  // Case #1: question ID is undefined -> Create a new question with current data
  if (!question.id) {
    console.log('in create question ');
    return createQuestion(questionnaireId, question);
  }

  // Case #2: question ID already exists -> Update question with new data
  return updateQuestion(questionnaireId, question);
};

const updateTopicBuilder = async (parent: any, args: any) => {
  console.log('In updateTopicBuilder');
  const questionnaireId: string = args.id || undefined;
  const { questions } : { questions: Array<IQuestionInput> } = args.topicData;
  // console.log('QUESTIONS: ', questions);
  const newQuestions = await Promise.all(questions.map((question) => {
    return handleQuestion(questionnaireId, question);
  }));

  return 'Succesfully updated topic(?)';
};

const queryResolvers = {
  questionNode: forwardTo("db"),
  questionNodes: forwardTo("db"),
  questionnaire: forwardTo("db"),
  questionnaires: forwardTo("db"),
  customers: forwardTo("db"),
  leafNode: forwardTo("db"),
  edges: forwardTo("db"),
  nodeEntryValues: forwardTo("db"),
  nodeEntries: forwardTo("db"),
  sessions: forwardTo("db"),
  session: forwardTo("db"),
  // TODO: Rename
  getQuestionnaireData: getQuestionnaireAggregatedData,
  nodeEntry: forwardTo("db"),
  newSessionId: () => crypto.randomBytes(16).toString("base64")
};

const mutationResolvers = {
  uploadUserSession: async (obj: any, args: any, ctx: any, info: any) => {
    const session = await prisma.createSession({});

    args.uploadUserSessionInput.entries.forEach(async (entry: any) => {
      const maybeCreateEdgeChild = (entry: any) => {
        if (entry.edgeId) {
          return { edgeChild: { connect: { id: entry.edgeId } } };
        }

        return {};
      };

      await prisma.createNodeEntry({
        ...maybeCreateEdgeChild(entry),
        session: {
          connect: {
            id: session.id
          }
        },
        relatedNode: {
          connect: {
            id: entry.nodeId
          }
        },
        depth: entry.depth,
        values: {
          create: {
            numberValue: cleanInt(entry.data.numberValue),
            textValue: entry.data.textValue
          }
        }
      });
    });
    return "Success!";
  },
  updateTopicBuilder,
  createNewCustomer: createNewCustomerMutation,
  deleteFullCustomer: deleteFullCustomerNode,
  createNewQuestionnaire,
  deleteQuestionnaire: forwardTo("db")
};

const resolvers = {
  Query: {
    ...queryResolvers
  },
  Mutation: {
    ...mutationResolvers
  },
  Node: {
    __resolveType(obj: any, ctx: any, info: any) {
      return obj.__typename;
    }
  }
};

export default resolvers;
