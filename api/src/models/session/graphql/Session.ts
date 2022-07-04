import { extendType, inputObjectType, mutationField, objectType } from '@nexus/schema';
import { UserInputError } from 'apollo-server-express';

import { NodeEntryDataInput, NodeEntryInput, NodeEntryType } from '../../node-entry/NodeEntry';
import { ConnectionInterface } from '../../general/Pagination';
import SessionService from '../SessionService';

export const SessionType = objectType({
  name: 'Session',
  definition(t) {
    t.id('id');
    t.date('createdAt');
    t.string('dialogueId');

    t.float('mainScore');

    t.string('browser', { resolve: (parent) => parent?.browser || '' });

    // t.int('index');
    t.int('paths', {
      async resolve(parent, args, ctx) {
        const entryCount = await ctx.services.nodeEntryService.countNodeEntriesBySessionid(parent.id);
        return entryCount;
      },
    });

    t.float('score', {
      async resolve(parent) {
        // @ts-ignore
        if (parent.score) return parent.score;
        if (parent.mainScore) return parent.mainScore;


        const score = await SessionService.findSessionScore(parent.id) || 0.0;

        return score;
      },
    });

    t.field('dialogue', {
      nullable: true,
      type: 'Dialogue',
    });

    t.int('totalTimeInSec', {
      nullable: true,
      resolve: (parent) => parent.totalTimeInSec || null,
    });

    t.string('originUrl', {
      nullable: true,
      resolve: (parent) => parent.originUrl || '',
    });

    t.string('device', { nullable: true });
    t.string('deliveryId', { nullable: true, resolve: (parent) => parent.deliveryId });

    t.field('delivery', {
      type: 'DeliveryType',
      nullable: true,
      resolve: async (parent, _, ctx) => {
        // @ts-ignore
        if (parent.delivery) return parent.delivery

        return ctx.services.campaignService.findDeliveryOfSession(parent.id);
      },
    });


    t.list.field('nodeEntries', {
      type: NodeEntryType,

      async resolve(parent, args, ctx) {
        // @ts-ignore
        if (parent.nodeEntries) return parent.nodeEntries;
        return ctx.services.nodeEntryService.getNodeEntriesBySessionId(parent.id);
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
      description: 'A session is one entire user-interaction',
      type: SessionType,
      args: { id: 'String' },
      nullable: true,

      async resolve(parent, args, ctx) {
        if (!args?.id) throw new UserInputError('No id provided as input');
        return ctx.services.sessionService.findSessionById(args.id);
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
    t.string('createdAt', { required: false });
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
      const session = ctx.services.sessionService.createSession(args.input);
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

  async resolve(parent, args, ctx) {
    if (!args?.input) throw new UserInputError('No valid new interaction data provided');
    if (!args?.input.sessionId) throw new UserInputError('No valid existing interaction found');

    const updatedInteraction = await ctx.services.nodeEntryService.createNodeEntry(args.input.sessionId, args.input);

    return updatedInteraction as any;
  },
});
