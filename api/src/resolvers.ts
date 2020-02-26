import { forwardTo } from 'prisma-binding';
import { QueryResolvers, MutationResolvers } from './generated/resolver-types';

const queryResolvers: QueryResolvers = {
  questionNodes: forwardTo('db'),
  questionnaire: forwardTo('db'),
  questionnaires: forwardTo('db'),
  leafNodes: forwardTo('db'),
  colourSettings: forwardTo('db'),
  customers: forwardTo('db'),
};

const mutationResolvers: MutationResolvers = {};

const resolvers = {
  Query: {
    ...queryResolvers,
  },
  Mutation: {
    ...mutationResolvers,
  },
};

export default resolvers;
