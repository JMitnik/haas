import { PrismaClient, Session } from '@prisma/client';
import { extendType, inputObjectType, mutationField, objectType } from '@nexus/schema';

// eslint-disable-next-line import/no-cycle
import { NodeEntryInput, NodeEntryType } from '../node-entry/NodeEntry';
import NodeEntryService from '../node-entry/NodeEntryService';
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

// TODO: Can we make this a generic type
export const SortFilterInputObject = inputObjectType({
  name: 'SortFilterInputObject',

  definition(t) {
    t.string('id', { required: false });
    t.boolean('desc', { required: false });
  },
});

// TODO: Can we make this a generic type
export const SortFilterObject = objectType({
  name: 'SortFilterObject',

  definition(t) {
    t.string('id');
    t.boolean('desc');
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

// TODO: Can we fold Interactions and Sessions together?
export const InteractionType = objectType({
  name: 'InteractionType',

  definition(t) {
    t.int('pages');
    t.int('pageIndex');
    t.int('pageSize');
    t.string('startDate', { nullable: true });
    t.string('endDate', { nullable: true });

    t.list.field('sessions', { type: InteractionSessionType });

    t.list.field('orderBy', { type: SortFilterObject });
  },
});

export const FilterInput = inputObjectType({
  name: 'FilterInput',

  definition(t) {
    t.string('startDate', { required: false });
    t.string('endDate', { required: false });
    t.string('searchTerm', { required: false });
    t.int('offset');
    t.int('limit');
    t.int('pageIndex');

    t.list.field('orderBy', {
      type: SortFilterInputObject,
      required: false,
    });
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

    t.field('interactions', {
      type: InteractionType,
      args: {
        where: SessionWhereUniqueInput,
        filter: FilterInput,
      },
      async resolve(parent, args) {
        const { pageIndex, offset, limit, startDate, endDate, searchTerm } = args.filter;
        const dateRange = SessionService.constructDateRangeWhereInput(startDate, endDate);
        const orderBy = args.filter.orderBy ? Object.assign({}, ...args.filter.orderBy) : null;

        const { pageSessions, totalPages, resetPages } = await NodeEntryService.getCurrentInteractionSessions(
          args.where.dialogueId,
          offset,
          limit,
          pageIndex,
          orderBy,
          dateRange,
          searchTerm,
        );

        const sessionsWithIndex = pageSessions.map((session, index) => ({ ...session, index }));

        return {
          sessions: sessionsWithIndex,
          pages: !resetPages ? totalPages : 1,
          offset,
          limit,
          pageIndex: !resetPages ? pageIndex : 0,
          startDate,
          endDate,
          orderBy: args.filter.orderBy || [],
        };
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
      return null;
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
  SortFilterObject,
  SortFilterInputObject,
  InteractionSessionType,
  FilterInput,
  InteractionType,
  SessionWhereUniqueInput,
  SessionQuery,
  SessionType,
  CreateSessionMutation,
  SessionInput,
];
