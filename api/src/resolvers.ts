import { forwardTo } from 'prisma-binding';
import crypto from 'crypto';
import _ from 'lodash';
import cleanInt from './utils/cleanInt';
import { prisma, ID_Input, Questionnaire } from './generated/prisma-client/index';
import { seedQuestionnare, createQuestionnaire } from '../data/seeds/make-company';

const deleteFullCustomerNode = async (parent: any, args:any) => {
  const { id } : { id: ID_Input} = args;
  const customerId = id;
  const customer = await prisma.deleteCustomer({ id: customerId });

  return customer;
};

const createNewCustomerMutation = async (parent: any, args: any) => {
  const { name, options } = args;
  const { isSeed, logo } = options;

  const customer = await prisma.createCustomer({
    name,
    settings: {
      create: {
        logoUrl: logo,
        colourSettings: {
          create: {
            primary: '#4287f5',
          },
        },
      },
    },
    questionnaires: {
      create: [],
    },
  });

  if (isSeed) {
    await createQuestionnaire(customer);
  }

  return customer;
};

const createNewQuestionnaire = async (
  parent: any,
  args: any,
): Promise<Questionnaire> => {
  const { customerId, title, description, publicTitle, isSeed } = args;
  let questionnaire = null;

  if (isSeed) {
    const customer = await prisma.customer({ id: customerId });

    if (customer?.name) {
      return seedQuestionnare(customerId, customer?.name, title, description);
    }

    console.log('Cant find customer with specified ID while seeding');
  }

  questionnaire = await prisma.createQuestionnaire({
    customer: {
      connect: {
        id: customerId,
      },
    },
    leafs: {
      create: [],
    },
    title,
    publicTitle,
    description,
    questions: {
      create: [],
    },
  });

  return questionnaire;
};

// TODO: Put these in a 'model' file, named Questionnaire (with a Questionnaire class). Create a new instance of Questionnaire, and call .getEntries
const getQuestionnaireAggregatedData = async (parent: any, args: any) => {
  const { topicId } = args;

  const customerName = (await prisma.questionnaire({ id: topicId }).customer())
    .name;
  const questionnaire: Questionnaire | null = await prisma.questionnaire({
    id: topicId,
  });

  if (questionnaire) {
    const { title, description, creationDate, updatedAt } = questionnaire;

    const questionNodes = await prisma.questionNodes({
      where: {
        questionnaire: {
          id: topicId,
        },
      },
    });

    const questionNodeIds = questionNodes.map((qNode) => qNode.id);

    const nodeEntries = (await prisma.nodeEntries({
      where: {
        relatedNode: {
          id_in: questionNodeIds,
        },
      },
    })) || [];

    const aggregatedNodeEntries = (await Promise.all(
      nodeEntries.map(async ({ id }) => {
        const values = await prisma.nodeEntry({ id }).values();
        const nodeEntry = await prisma.nodeEntry({ id });
        const sessionId = (await prisma.nodeEntry({ id }).session()).id;

        const mappedResult = {
          sessionId,
          createdAt: nodeEntry?.creationDate,
          value: values[0].numberValue ? values[0].numberValue : -1,
        };
        return mappedResult;
      }),
    )) || [];

    const filterNodes = aggregatedNodeEntries.filter((node) => node?.value !== -1) || [];

    const filteredNodeData = filterNodes.map((node) => node?.value) || [];

    const nrEntries = filteredNodeData.reduce(
      (total = 0, previousValue) => total + previousValue,
      0,
    );

    const averageSliderResult = (
      filteredNodeData.length > 0 && nrEntries / filteredNodeData.length
    ).toString() || 'N/A';

    const orderedTimelineEntries = _.orderBy(filterNodes, (filterNode) => filterNode.createdAt, 'desc') || [];

    return {
      customerName,
      title,
      timelineEntries: orderedTimelineEntries,
      description,
      creationDate,
      updatedAt,
      average: averageSliderResult,
      totalNodeEntries: filterNodes.length,
    };
  }

  // TODO: What will we return here?
  return {};
};

const queryResolvers = {
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
  getQuestionnaireData: getQuestionnaireAggregatedData,
  nodeEntry: forwardTo('db'),
  newSessionId: () => crypto.randomBytes(16).toString('base64'),
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
            id: session.id,
          },
        },
        relatedNode: {
          connect: {
            id: entry.nodeId,
          },
        },
        depth: entry.depth,
        values: {
          create: {
            numberValue: cleanInt(entry.data.numberValue),
            textValue: entry.data.textValue,
            multiValues: {
              create: entry.data.multiValues,
            },
          },
        },
      });
    });
    return 'Success!';
  },
  createNewCustomer: createNewCustomerMutation,
  deleteFullCustomer: deleteFullCustomerNode,
  createNewQuestionnaire,
  deleteQuestionnaire: forwardTo('db'),
};

const resolvers = {
  Query: {
    ...queryResolvers,
  },
  Mutation: {
    ...mutationResolvers,
  },
  Node: {
    __resolveType(obj: any, ctx: any, info: any) {
      return obj.__typename;
    },
  },
};

export default resolvers;
