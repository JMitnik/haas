import { PrismaClient, Session } from '@prisma/client';
import { extendType, inputObjectType, mutationField, objectType } from '@nexus/schema';

// eslint-disable-next-line import/no-cycle
import { NodeEntryInput, NodeEntryType } from '../node-entry/NodeEntry';
// eslint-disable-next-line import/no-cycle
import { ConnectionInterface } from '../general/Pagination';
// eslint-disable-next-line import/no-cycle
import SessionService from './SessionService';

export const SessionType = objectType({
  name: 'Session',
  definition(t) {
    t.id('id');
    t.string('createdAt');
    t.string('dialogueId');

    t.float('score', {
      async resolve(parent) {
        const score = await SessionService.getSessionScore(parent.id) || 0.0;

        return score;
      },
    });

    t.list.field('nodeEntries', {
      type: NodeEntryType,
      resolve(parent: Session, args, ctx) {
        const { prisma }: { prisma: PrismaClient } = ctx;
        const nodeEntries = prisma.nodeEntry.findMany({
          where: { sessionId: parent.id },
          include: {
            choiceNodeEntry: true,
            linkNodeEntry: true,
            registrationNodeEntry: true,
            sliderNodeEntry: true,
            textboxNodeEntry: true,
          },
        });

        return nodeEntries;
      },
    });
  },
});

export const SessionWhereUniqueInput = inputObjectType({
  name: 'SessionWhereUniqueInput',

  definition(t) {
    t.id('id', { required: false });
    t.id('dialogueId', { required: false });
  },
});

// TODO: Can we fold Interactions and Sessions together?
export const InteractionSessionType = objectType({
  name: 'InteractionSessionType',

  definition(t) {
    t.string('id');
    t.int('index');
    t.int('paths');
    t.string('createdAt');

    t.float('score', { nullable: true });

    t.list.field('nodeEntries', { type: NodeEntryType });
  },
});

export const SessionConnection = objectType({
  name: 'SessionConnection',

  definition(t) {
    t.implements(ConnectionInterface);
    t.list.field('sessions', { type: SessionType });
  },
});

export const SessionQuery = extendType({
  type: 'Query',

  definition(t) {
    t.list.field('sessions', {
      type: SessionType,
      args: { where: SessionWhereUniqueInput },
      async resolve(parent, args) {
        if (!args.where?.dialogueId) {
          return [];
        }

        const sessions = await SessionService.getDialogueSessions(args.where.dialogueId);

        if (!sessions?.length) {
          return [];
        }

        return sessions;
      },
    });

    t.field('session', {
      type: SessionType,
      args: { where: SessionWhereUniqueInput },
      nullable: true,

      async resolve(parent, args, ctx) {
        if (!args.where?.id) {
          return null;
        }

        const session = await ctx.prisma.session.findOne({
          where: {
            id: args.where.id,
          },
        });

        return session;
      },
    });
  },
});

export const SessionInput = inputObjectType({
  name: 'SessionInput',
  description: 'Input for session',

  definition(t) {
    t.string('dialogueId', { required: true });

    t.list.field('entries', { type: NodeEntryInput });
  },
});

export const CreateSessionMutation = mutationField('createSession', {
  type: SessionType,
  args: { data: SessionInput },

  resolve(parent, args, ctx) {
    if (!args?.data) {
      throw new Error('No valid new session data provided');
    }

    try {
      const session = SessionService.createSession(args.data, ctx);
      return session;
    } catch (error) {
      throw new Error(`Failed making a session due to ${error}`);
    }
  },
});

export default [
  InteractionSessionType,
  SessionConnection,
  SessionWhereUniqueInput,
  SessionQuery,
  SessionType,
  CreateSessionMutation,
  SessionInput,
];
