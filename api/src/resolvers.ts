import { forwardTo } from 'prisma-binding';

import { QueryResolvers, MutationResolvers } from './generated/resolver-types';
import { prisma, ID_Input, Questionnaire } from './generated/prisma-client/index';
import seedCompany, { seedQuestionnare } from '../data/seeds/make-company';

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
    console.log('Seed for questionnaire has been selected. Seeding...');
    const customer = await prisma.customer({ id: customerId });

    if (customer?.name) {
      console.log('CUSTOMER NAME IS: ', customer?.name);
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
