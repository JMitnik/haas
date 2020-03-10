import { forwardTo } from 'prisma-binding';
import { QueryResolvers, MutationResolvers } from './generated/resolver-types';
import { prisma, NodeType, CustomerSettingsCreateInput, CustomerSettings } from './generated/prisma-client/index';
import seedCompany from '../data/seeds/make-company';

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

const createNewCustomerMutation = async (parent : any, args: any) => {
  console.log('Data: ', args);
  const { name, options } = args;
  const { isSeed, logo } = options;

  const customer = await prisma.createCustomer({
    name,
    settings: {
      create: {
        logoUrl: logo,
        colourSettings: {
          create: {
            primary: 'white',
          },
        },
      },
    },
    questionnaires: {
      create: [],
    },
  });

  if (isSeed) {
    console.log('IS SEED... SEEDING>>>');
    await seedCompany(customer);
    console.log('Company has been seeded');
    // GENERATE SEED FOR CUSTOMER
  }

  return customer;
};

const mutationResolvers: MutationResolvers = {
  createNewCustomer: createNewCustomerMutation,
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
