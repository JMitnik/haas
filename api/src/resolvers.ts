import { forwardTo } from 'prisma-binding';
import _ from 'lodash';

import { QueryResolvers, MutationResolvers } from './generated/resolver-types';
import { prisma, ID_Input, Questionnaire } from './generated/prisma-client/index';
import seedCompany, { seedQuestionnare } from '../data/seeds/make-company';

// TODO: Put these in a 'model' file, named Questionnaire (with a Questionnaire class). Create a new instance of Questionnaire, and call .getEntries
const getQuestionnaireAggregatedData = async (parent: any, args: any) => {
  const { topicId } = args;

  const customerName = (await prisma.questionnaire({ id: topicId }).customer()).name;
  const questionnaire: Questionnaire | null = (await prisma.questionnaire({ id: topicId }));

  if (questionnaire) {
    const { title, description, creationDate, updatedAt } = questionnaire;

    const questionNodes = await prisma.questionNodes({ where: {
      questionnaire: {
        id: topicId,
      },
    } });

    const questionNodeIds = questionNodes.map((qNode) => qNode.id);

    const nodeEntries = await prisma.nodeEntries({ where: {
      relatedNode: {
        id_in: questionNodeIds,
      },
    } }) || [];

    const aggregatedNodeEntries = await Promise.all(nodeEntries.map(async ({ id }) => {
      const values = await prisma.nodeEntry({ id }).values();
      const nodeEntry = await prisma.nodeEntry({ id });

      const mappedResult = {
        sessionId: nodeEntry?.sessionId,
        createdAt: nodeEntry?.creationDate,
        value: values[0].numberValue ? values[0].numberValue : -1,
      };
      return mappedResult;
    })) || [];

    const filterNodes = aggregatedNodeEntries.filter((node) => {
      return node?.value !== -1;
    }) || [];

    const filteredNodeData = (filterNodes.map((node) => {
      return node?.value;
    })) || [];

    const nrEntries = filteredNodeData.reduce(
      (total = 0, previousValue) => total + previousValue, 0,
    );

    const averageSliderResult = (
      filteredNodeData.length > 0 && nrEntries / filteredNodeData.length).toString()
      || 'N/A';

    const orderedTimelineEntries = _.orderBy(filterNodes, (filterNode) => {
      return filterNode.createdAt;
    }, 'desc') || [];

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

const queryResolvers: QueryResolvers = {
  questionNodes: forwardTo('db'),
  questionNode: forwardTo('db'),
  questionnaire: forwardTo('db'),
  questionnaires: forwardTo('db'),
  leafNodes: forwardTo('db'),
  colourSettings: forwardTo('db'),
  customers: forwardTo('db'),
  leafNode: forwardTo('db'),
  edges: forwardTo('db'),
  nodeEntries: forwardTo('db'),
  nodeEntryValues: forwardTo('db'),
  // TODO: Rename
  getQuestionnaireData: getQuestionnaireAggregatedData,
};

const deleteFullCustomerNode = async (parent: any, args:any) => {
  const { id } : { id: ID_Input} = args;
  const customerId = id;
  const customer = await prisma.deleteCustomer({ id: customerId });

  return customer;
};

const createNewCustomerMutation = async (parent : any, args: any) => {
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
    await seedCompany(customer);
  }

  return customer;
};

const createNewQuestionnaire = async (parent : any, args: any): Promise<Questionnaire> => {
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

const mutationResolvers: MutationResolvers = {
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
};

export default resolvers;
