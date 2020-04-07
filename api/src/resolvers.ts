import { forwardTo } from 'prisma-binding';
import crypto from 'crypto';
import { ServiceContainerProps } from './services/service-container';
import { QueryResolvers } from './generated/resolver-types';
import { Prisma } from './generated/prisma-client/index';
import SessionResolver from './models/session/session-resolver';
import CustomerResolver from './models/customer/customer-resolver';
import DialogueResolver from './models/questionnaire/questionnaire-resolver';

interface ContextProps {
  db: Prisma;
  services: ServiceContainerProps;
}

const queryResolvers: QueryResolvers<ContextProps> = {
  questionNode: forwardTo('db'),
  questionNodes: forwardTo('db'),
  questionnaire: forwardTo('db'),
  questionnaires: forwardTo('db'),
  customers: forwardTo('db'),
  leafNode: forwardTo('db'),
  edges: forwardTo('db'),
  nodeEntryValues: forwardTo('db'),
  nodeEntries: forwardTo('db'),
  sessions: forwardTo('db'),
  session: forwardTo('db'),
  // TODO: Rename
  getQuestionnaireData: DialogueResolver.getQuestionnaireAggregatedData,
  nodeEntry: forwardTo('db'),
  newSessionId: () => crypto.randomBytes(16).toString('base64'),
};

const mutationResolvers = {
  uploadUserSession: SessionResolver.uploadUserSession,
  createNewCustomer: CustomerResolver.createNewCustomerMutation,
  deleteFullCustomer: CustomerResolver.deleteFullCustomerNode,
  createNewQuestionnaire: DialogueResolver.createNewQuestionnaire,
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
