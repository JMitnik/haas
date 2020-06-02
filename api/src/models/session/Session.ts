import _ from 'lodash';
import { NodeEntry, NodeEntryValue, Session, PrismaClient, SessionWhereInput, NodeEntryWhereInput } from '@prisma/client';
import { objectType, extendType, inputObjectType } from '@nexus/schema';
import SessionResolver from './session-resolver';
import NodeEntryResolver from '../nodeentry/nodeentry-resolver';
import { QuestionNodeType } from '../question/QuestionNode';

export const NodeEntryValueType = objectType({
  name: 'NodeEntryValue',
  definition(t) {
    t.id('id');
    t.int('numberValue', { nullable: true });
    t.string('textValue', { nullable: true });
    t.string('nodeEntryId', { nullable: true });
    t.int('parentNodeEntryValueId', { nullable: true });
    t.list.field('multiValues', {
      type: NodeEntryValueType,
      resolve(parent: NodeEntryValue, args: any, ctx: any) {
        const multiValues = ctx.prisma.nodeEntryValue.findMany(
          { where: { parentNodeEntryValueId: parent.id } },
        );
        return multiValues;
      },
    });
  },
});

export const NodeEntryType = objectType({
  name: 'NodeEntry',
  definition(t) {
    t.id('id', { nullable: true });
    t.string('creationDate');
    t.int('depth');
    t.string('relatedEdgeId', { nullable: true });
    t.string('relatedNodeId', { nullable: true });
    t.string('sessionId');
    t.field('relatedNode', {
      type: QuestionNodeType,
      nullable: true,
      resolve(parent: NodeEntry, args: any, ctx: any) {
        if (!parent.relatedNodeId) {
          return null;
        }
        const relatedNode = ctx.prisma.questionNode.findOne(
          { where: { id: parent.relatedNodeId } },
        );
        return relatedNode;
      },
    });
    t.list.field('values', {
      type: NodeEntryValueType,
      resolve(parent: NodeEntry, args: any, ctx: any) {
        const values = ctx.prisma.nodeEntryValue.findMany(
          { where: { nodeEntryId: parent.id } },
        );
        return values;
      },
    });
  },
});

export const SessionType = objectType({
  name: 'Session',
  definition(t) {
    t.id('id');
    t.string('createdAt');
    t.string('dialogueId');
    t.list.field('nodeEntries', {
      type: NodeEntryType,
      resolve(parent: Session, args: any, ctx: any) {
        const nodeEntries = ctx.prisma.nodeEntry.findMany({
          where: {
            sessionId: parent.id,
          },
        });
        return nodeEntries;
      },
    });
  },
});

export const UniqueDataResultEntry = objectType({
  name: 'UniqueDataResultEntry',
  definition(t) {
    t.string('sessionId');
    t.string('createdAt');
    t.int('value');
  },
});

export const UserSessionEntryDataInput = inputObjectType({
  name: 'UserSessionEntryDataInput',
  definition(t) {
    t.string('textValue');
    t.int('numberValue');
    t.list.field('multiValues', {
      type: UserSessionEntryDataInput,
    });
  },
});

export const UserSessionEntryInput = inputObjectType({
  name: 'UserSessionEntryInput',
  definition(t) {
    t.string('nodeId');
    t.string('edgeId', { nullable: true });
    t.int('depth', { nullable: true });
    t.field('data', {
      type: UserSessionEntryDataInput,
    });
  },
});

export const UploadUserSessionInput = inputObjectType({
  name: 'UploadUserSessionInput',
  definition(t) {
    t.string('dialogueId', { required: true });
    t.list.field('entries', {
      type: UserSessionEntryInput,
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

export const SortFilterInputObject = inputObjectType({
  name: 'SortFilterInputObject',
  definition(t) {
    t.string('id', { required: false });
    t.boolean('desc', { required: false });
  },
});

export const SortFilterObject = objectType({
  name: 'SortFilterObject',
  definition(t) {
    t.string('id');
    t.boolean('desc');
  },
});

export const InteractionSessionType = objectType({
  name: 'InteractionSessionType',
  definition(t) {
    t.string('id');
    t.int('index');
    t.float('score');
    t.int('paths');
    t.string('createdAt');
    t.list.field('nodeEntries', {
      type: NodeEntryType,
    });
  },
});

export const InteractionType = objectType({
  name: 'InteractionType',
  definition(t) {
    t.list.field('sessions', {
      type: InteractionSessionType,
    });
    t.int('pages');
    t.int('pageIndex');
    t.int('pageSize');
    t.list.field('orderBy', {
      type: SortFilterObject,
    });
    t.string('startDate', { nullable: true });
    t.string('endDate', { nullable: true });
  },
});

export const InteractionFilterInput = inputObjectType({
  name: 'InteractionFilterInput',
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

export const getSessionAnswerFlowQuery = extendType({
  type: 'Query',
  definition(t) {
    t.field('getSessionAnswerFlow', {
      type: SessionType,
      args: {
        sessionId: 'ID',
      },
    });
    t.field('interactions', {
      type: InteractionType,
      args: {
        where: SessionWhereUniqueInput,
        filter: InteractionFilterInput,
      },
      async resolve(parent: any, args: any, ctx: any) {
        const { prisma }: { prisma: PrismaClient } = ctx;
        const { pageIndex, offset, limit, startDate, endDate, searchTerm }: { pageIndex: number, offset: number, limit: number, startDate: Date, endDate: Date, searchTerm: string } = args.filter;

        const dateRange = SessionResolver.constructDateRangeWhereInput(startDate, endDate);
        const valuesCondition = NodeEntryResolver.constructValuesWhereInput(searchTerm);

        const orderBy = args.filter.orderBy ? Object.assign({}, ...args.filter.orderBy) : null;
        let pageSessionIds: Array<any> = [];
        if (orderBy.id === 'score') {
          const nodeEntriesScore = await prisma.nodeEntry.findMany(
            {
              where: {
                session: {
                  dialogueId: args.where.dialogueId,
                  AND: dateRange,
                },
                OR: valuesCondition,
              },
              include: {
                values: true,
              },
            },
          );
          console.log('pages nodeEntries: ', Math.ceil(nodeEntriesScore.length / limit));
          let flatMerged;
          if (searchTerm) {
            const groupedScoreSessions = _.groupBy(nodeEntriesScore, (entry) => entry.sessionId);
            const merged = _.filter(groupedScoreSessions, (session) => session.length > 1);
            flatMerged = _.flatten(merged);
          }
          const finalNodeEntryScore = flatMerged || nodeEntriesScore;
          const filteredNodeEntresScore = _.filter(finalNodeEntryScore, (nodeEntryScore) => nodeEntryScore.depth === 0);
          const orderedNodeEntriesScore = _.orderBy(filteredNodeEntresScore, (entry) => entry.values[0].numberValue, orderBy.desc ? 'desc' : 'asc');
          const pageNodeEntries = (offset + limit) < orderedNodeEntriesScore.length
            ? orderedNodeEntriesScore.slice(offset, (pageIndex + 1) * limit)
            : orderedNodeEntriesScore.slice(offset, orderedNodeEntriesScore.length);
          pageSessionIds = pageNodeEntries.map((entry) => entry.sessionId);
        }

        const sessionWhereClause = SessionResolver.constructInteractionWhereInput(args.where.dialogueId, searchTerm, dateRange, pageSessionIds);
        console.log('session where clause: ', sessionWhereClause);

        const pages = await prisma.session.findMany({
          where: {
            dialogueId: sessionWhereClause.dialogueId,
            AND: sessionWhereClause.AND,
            nodeEntries: sessionWhereClause.nodeEntries,
          },
        });

        const orderByClause = orderBy.id !== 'score' ? {
          [orderBy.id]: orderBy.desc ? 'desc' : 'asc',
        } : null;
        const skipClause = pageSessionIds.length === 0 ? offset : null;
        const firstClause = pageSessionIds.length === 0 ? limit : null;

        const sessions = await prisma.session.findMany({
          skip: skipClause,
          first: firstClause,
          orderBy: orderByClause,
          where: sessionWhereClause,
          include: {
            nodeEntries: {
              select: {
                id: true,
                creationDate: true,
                depth: true,
                relatedNodeId: true,
                values: {
                  select: {
                    id: true,
                    nodeEntryId: true,
                    numberValue: true,
                    textValue: true,
                    multiValues: true,
                  },
                },
              },
            },
          },
        });

        console.log('Pages: ', Math.ceil(pages.length / limit));
        let mappedSessions = sessions.map((session) => {
          const { createdAt, nodeEntries } = session;
          const score = session.nodeEntries.find((entry) => entry.depth === 0)?.values?.[0]?.numberValue;
          const paths = session.nodeEntries.length;
          return {
            id: session.id, score, paths, createdAt, nodeEntries,
          };
        });

        const orderedSessions = pageSessionIds.length > 0 ? _.orderBy(mappedSessions, (session) => session.score, orderBy.desc ? 'desc' : 'asc') : [];
        mappedSessions = orderedSessions.length > 0 ? orderedSessions : mappedSessions;
        const finalSessions = mappedSessions.map((session, index) => ({ ...session, index }));
        return {
          // FIXME: Page 3 of 2 when search query (where max 16 rows exist e.g. Facilities)
          // is entered while being on page 3 of full overview. It won't be able to find data for page 3
          // => Should display data of page 1 instead and set pageIndex to 0
          sessions: finalSessions,
          pages: Math.ceil(pages.length / limit),
          offset,
          limit,
          pageIndex: (finalSessions.length > limit) ? pageIndex : 0,
          startDate,
          endDate,
          orderBy: args.filter.orderBy || [],
        };
      },
    });
    t.list.field('sessions', {
      type: SessionType,
      args: {
        where: SessionWhereUniqueInput,
      },
      resolve(parent: any, args: any, ctx: any) {
        if (!args.where) {
          const sessions = ctx.prisma.session.findMany();
          return sessions;
        }

        const sessions = ctx.prisma.session.findMany({
          where: {
            dialogueId: args.where.dialogueId,
          },
        });
        return sessions;
      },
    });
    t.field('session', {
      type: SessionType,
      args: {
        where: SessionWhereUniqueInput,
      },
      resolve(parent: any, args: any, ctx: any) {
        const session = ctx.prisma.session.findOne({
          where: {
            id: args.where.id,
          },
        });
        return session;
      },
    });
  },
});

export const uploadUserSessionMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('uploadUserSession', {
      type: SessionType,
      args: {
        uploadUserSessionInput: UploadUserSessionInput,
      },
      resolve(parent: any, args: any, ctx: any) {
        const session = SessionResolver.uploadUserSession(parent, args, ctx);
        return session;
      },
    });
  },
});

const sessionNexus = [
  SortFilterObject,
  SortFilterInputObject,
  InteractionSessionType,
  InteractionFilterInput,
  InteractionType,
  SessionWhereUniqueInput,
  getSessionAnswerFlowQuery,
  UniqueDataResultEntry,
  NodeEntryValueType,
  NodeEntryType,
  SessionType,
  uploadUserSessionMutation,
  UploadUserSessionInput,
  UserSessionEntryInput,
  UserSessionEntryDataInput,
];

export default sessionNexus;
