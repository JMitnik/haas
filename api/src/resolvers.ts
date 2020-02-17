import { forwardTo } from 'prisma-binding';
import { QueryResolvers, MutationResolvers } from './generated/resolver-types';
import { prisma } from './generated/prisma-client';

const queryResolvers: QueryResolvers = {
  questions: forwardTo('db'),
  topics: forwardTo('db'),
};

const mutationResolvers: MutationResolvers = {
  createTopic: async (parent, { data }) => {
    // TODO: Fix type-mismatch between questions from resolver-types and index
    const { title, publicTitle, description } = data;

    const topic = await prisma.createTopic({ title, publicTitle, description });

    return topic;
  },
  deleteManyTopics: forwardTo('db'),
  deleteTopic: forwardTo('db'),
  createQuestion: async () => {
    const question = await prisma.createQuestion({});

    return {
      id: question.id,
    };
  },
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
