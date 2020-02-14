import { forwardTo, Prisma } from 'prisma-binding';
import { QueryResolvers, MutationResolvers } from './generated/resolver-types';
import { prisma } from './generated/prisma-client';

const queryResolvers: QueryResolvers = {
  questionNodes: forwardTo('db'),
  questionnaire: forwardTo('db'),
  questionnaires: forwardTo('db'),
  leafNodes: forwardTo('db')
  // questions: forwardTo('db'),
  // topics: forwardTo('db'),
}

const MutationResolvers: MutationResolvers = {
  // createTopic: async (parent, { data }, ctx, info) => {

  //   // TODO: Fix type-mismatch between questions from resolver-types and index
  //   const { title, publicTitle, description } = data;
    
  //   const topic = await prisma.createTopic({title, publicTitle, description});

  //   return topic;
  // },
  // deleteManyTopics: forwardTo('db'),
  // deleteTopic: forwardTo('db'),
  // createQuestion: async (parent, { data }, ctx, info) => {
  //   const question = await prisma.createQuestion({});

  //   return {
  //     id: question.id
  //   }
  // }
}

const resolvers = {
  Query: {
    ...queryResolvers
  },
  Mutation: {
    ...MutationResolvers
  }
};

export default resolvers;
