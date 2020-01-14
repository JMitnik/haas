import { forwardTo, Prisma } from 'prisma-binding';
import { QueryResolvers, MutationResolvers } from './generated/resolver-types';
import { prisma } from './generated/prisma-client';

const QueryResolvers: QueryResolvers = {
  questions: forwardTo('db'),
  topics: forwardTo('db'),
}

const MutationResolvers: MutationResolvers = {
  createTopic: async (parent, { data }, ctx, info) => {

    // TODO: Fix type-mismatch between questions from resolver-types and index
    const { title, language, description, questions } = data;

    const topic = await prisma.createTopic({title, language, description});

    return {
      id: topic.id,
      title,
      language,
      description
    }
  },
  createQuestion: async (parent, { data }, ctx, info) => {
    const question = await prisma.createQuestion({});

    return {
      id: question.id
    }
  }
}

const resolvers = {
  Query: {
    ...QueryResolvers
  },
  Mutation: {
    ...MutationResolvers
  }
};

export default resolvers;
