import { extendType, inputObjectType, mutationField, objectType } from '@nexus/schema';

// eslint-disable-next-line import/no-cycle
import { UserInputError } from 'apollo-server-express';
import { NodeEntryDataInput, NodeEntryInput, NodeEntryType } from '../node-entry/NodeEntry';
// eslint-disable-next-line import/no-cycle
import { ConnectionInterface } from '../general/Pagination';
// eslint-disable-next-line import/no-cycle
import NodeEntryService from '../node-entry/NodeEntryService';
import SessionService from './SessionService';

export const SessionType = objectType({
  name: 'Session',
  definition(t) {
    t.id('id');
    t.date('createdAt');
    t.string('dialogueId');

    // t.int('index');
    t.int('paths', {
      async resolve(parent, args, ctx) {
        const entryCount = await ctx.prisma.nodeEntry.count({ where: { sessionId: parent.id } });
        return entryCount;
      },
    });

    t.float('score', {
      async resolve(parent) {
        // @ts-ignore
        if (parent.score) return parent.score;

        const score = await SessionService.getSessionScore(parent.id) || 0.0;

        return score;
      },
    });

    t.int('totalTimeInSec', {
      nullable: true,
      resolve: (parent) => parent.totalTimeInSec || null
    });

    t.string('originUrl', {
      nullable: true,
      resolve: (parent) => parent.originUrl || ''
    });

    t.field('delivery', { type: 'DeliveryType', nullable: true });

    t.string('device', { nullable: true });

    t.list.field('nodeEntries', {
      type: NodeEntryType,

      async resolve(parent, args, ctx) {
        const nodeEntries = await ctx.prisma.nodeEntry.findMany({
          where: { sessionId: parent.id },
          include: {
            choiceNodeEntry: true,
            linkNodeEntry: true,
            registrationNodeEntry: true,
            sliderNodeEntry: true,
            textboxNodeEntry: true,
          },
          orderBy: {
            depth: 'asc',
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

        const sessions = await SessionService.fetchSessionsByDialogue(args.where.dialogueId);

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

    t.string('deliveryId', { required: false });
    t.string('originUrl', { required: false });
    t.string('device', { required: false });
    t.int('totalTimeInSec', { required: false });
  },
});

export const CreateSessionMutation = mutationField('createSession', {
  type: SessionType,
  args: { input: SessionInput },

  resolve(parent, args, ctx) {
    if (!args?.input) {
      throw new Error('No valid new session data provided');
    }

    try {
      const session = SessionService.createSession(args.input, ctx);
      return session;
    } catch (error) {
      throw new Error(`Failed making a session due to ${error}`);
    }
  },
});

export const AppendToInteractionInput = inputObjectType({
  name: 'AppendToInteractionInput',
  description: 'Append new data to an uploaded session',

  definition(t) {
    t.id('sessionId');
    t.string('nodeId');
    t.string('edgeId', { nullable: true });

    t.field('data', { type: NodeEntryDataInput });
  },
});

export const AppendToInteractionMutation = mutationField('appendToInteraction', {
  type: SessionType,
  args: { input: AppendToInteractionInput },

  resolve(parent, args, ctx) {
    if (!args?.input) throw new UserInputError('No valid new interaction data provided');
    if (!args?.input.sessionId) throw new UserInputError('No valid existing interaction found');

    const updatedInteraction = ctx.prisma.nodeEntry.create({
      data: {
        session: { connect: { id: args.input.sessionId } },
        ...NodeEntryService.constructCreateNodeEntryFragment(args.input),
      },
    });

    return updatedInteraction as any;
  },
});
