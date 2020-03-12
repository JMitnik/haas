import { forwardTo } from 'prisma-binding';
import * as _ from 'lodash';

import { QueryResolvers, MutationResolvers } from './generated/resolver-types';
import { prisma, ID_Input } from './generated/prisma-client/index';
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

const mutationResolvers: MutationResolvers = {
  createNewCustomer: createNewCustomerMutation,
  deleteFullCustomer: deleteFullCustomerNode,
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
