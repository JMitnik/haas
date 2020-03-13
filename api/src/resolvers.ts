import { forwardTo } from 'prisma-binding';
import crypto from 'crypto';
import { QueryResolvers, MutationResolvers } from './generated/resolver-types';
import { prisma } from './generated/prisma-client';

const queryResolvers = {
  questionNode: forwardTo('db'),
  questionNodes: forwardTo('db'),
  questionnaire: forwardTo('db'),
  questionnaires: forwardTo('db'),
  customers: forwardTo('db'),
  nodeEntries: forwardTo('db'),
  nodeEntry: forwardTo('db'),
  newSessionId: () => crypto.randomBytes(16).toString('base64'),
};

const mutationResolvers = {
  uploadUserEntries: async (obj: any, args: any, ctx: any, info: any) => {
    args.uploadEntriesInput.entries.forEach(async (entry: any) => {
      const maybeCreateEdgeChild = (entry: any) => {
        if (entry.data.edgeId) {
          return {
            edgeChild: {
              connect: {
                id: entry.data.edgeId,
              },
            },
          };
        }

        return {};
      };

      await prisma.createNodeEntry({
        sessionId: args.uploadEntriesInput.sessionId,
        ...maybeCreateEdgeChild(entry),
        relatedNode: {
          connect: {
            id: entry.data.nodeId,
          },
        },
        values: {
          create: {
            numberValue: entry.data.numberValue,
            textValue: entry.data.textValue,
          },
        },
      });
    });
    return 'Success!';
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
