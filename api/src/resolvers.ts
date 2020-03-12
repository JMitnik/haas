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
// const deleteFullCustomerNode = async (parent: any, args:any) => {
//   const { id } : { id: ID_Input} = args;
//   const customerId = id;
//   // 1. Get questionnaires ids connected to customer
//   console.log('ID: ', id);
//   const questionnaires = await prisma.questionnaires({
//     where: {
//       customer: {
//         id: customerId,
//       },
//     },
//   });

//   console.log('Questionnaires of customer: ', questionnaires);

//   const questionnaireIds = questionnaires.map((questionnaire) => questionnaire.id);

//   // 1. Get the edges and all ids in parent + child node fields

//   // 2. Get Questions connected to questionnaires

//   const questions = await prisma.questionNodes({
//     where: {
//       id_in: questionnaireIds,
//     },
//   });

//   console.log('Questions of customer: ', questions.length);

//   const questionIds = questions.map((question) => question.id);

//   // Remove Question + connected options, conditions, edges
//   await Promise.all(_.forEach(questionIds, async (questionId) => {
//     const questionNode = prisma.questionNode({ id: questionId });

//     const questionOptionIds = await Promise.all((await questionNode.options())
//       .map((option) => option.id));

//     await Promise.all(_.forEach(questionOptionIds, async (questionOptionId) => {
//       await prisma.deleteQuestionOption({ id: questionOptionId });
//     }));

//     const questionConditionIds = await Promise.all((await questionNode.conditions())
//       .map((condition) => condition.id));

//     await Promise.all(_.forEach(questionConditionIds, async (questionConditionId) => {
//       await prisma.deleteQuestionCondition({ id: questionConditionId });
//     }));

//     const edgeIds = await Promise.all((await questionNode.edgeChildren())
//       .map((edgeChild) => edgeChild.id));

//     await Promise.all(_.forEach(edgeIds, async (edgeId) => {
//       await prisma.deleteQuestionCondition({ id: edgeId });
//     }));

//     await prisma.deleteQuestionNode({ id: questionId });
//   }));

//   // Remove Customer + questionnaires related to customer (onDelete: CASCADE option in datamodel)
//   const customer = await prisma.deleteCustomer({
//     id: customerId,
//   });

//   return customer;

//   // 2. Remove settings + colour settings related to customer
// };

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
    console.log('IS SEED... SEEDING>>>');
    await seedCompany(customer);
    console.log('Company has been seeded');
    // GENERATE SEED FOR CUSTOMER
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
