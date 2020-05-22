import _ from 'lodash';
import { format } from 'date-fns';
import { NodeEntry, NodeEntryValue, Session, PrismaClient, SessionWhereInput } from '@prisma/client';
import { objectType, extendType, inputObjectType } from '@nexus/schema';
import SessionResolver from './session-resolver';
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
      resolve(parent: NodeEntryValue, args: any, ctx: any, info: any) {
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
    t.id('id');
    t.string('creationDate');
    t.int('depth');
    t.string('relatedEdgeId', { nullable: true });
    t.string('relatedNodeId');
    t.string('sessionId');
    t.field('relatedNode', {
      type: QuestionNodeType,
      resolve(parent: NodeEntry, args: any, ctx: any, info: any) {
        const relatedNode = ctx.prisma.questionNode.findOne(
          { where: { id: parent.relatedNodeId } },
        );
        return relatedNode;
      },
    });
    t.list.field('values', {
      type: NodeEntryValueType,
      resolve(parent: NodeEntry, args: any, ctx: any, info: any) {
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
      resolve(parent: Session, args: any, ctx: any, info: any) {
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

export const InteractionSessionType = objectType({
  name: 'InteractionSessionType',
  definition(t) {
    t.string('sessionId');
    t.int('index');
    t.float('score');
    t.int('paths');
    t.string('createdAt');
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
  },
});

export const InteractionFilterInput = inputObjectType({
  name: 'InteractionFilterInput',
  definition(t) {
    t.string('startDate', { required: false });
    t.string('endDate', { required: false });
    t.int('offset', { required: false });
    t.int('limit', { required: false });
    t.int('pageIndex', { required: false });
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
        console.log('filter interactions: ', args.filter);
        // TODO: Add orderBy filter
        const { pageIndex, offset, limit, startDate, endDate }: { pageIndex: number, offset: number, limit: number, startDate: Date, endDate: Date } = args.filter;
        let dateRange: SessionWhereInput[] | [] = [];
        if (startDate && !endDate) {
          dateRange = [
            { createdAt: { gte: startDate } },
          ];
        }

        if (startDate && endDate) {
          dateRange = [
            { createdAt: { gte: startDate } },
            { createdAt: { lte: endDate } }];
        }

        const pages = await prisma.session.findMany({
          where: {
            dialogueId: args.where.dialogueId,
            AND: dateRange,
          },
        });

        const sessions = await prisma.session.findMany({
          skip: offset,
          first: limit,
          orderBy: {
            id: 'desc',
          },
          where: {
            dialogueId: args.where.dialogueId,
            AND: dateRange,
          },
          include: {
            nodeEntries: {
              select: {
                creationDate: true,
                depth: true,
                values: {
                  select: {
                    id: true,
                    nodeEntryId: true,
                    numberValue: true,
                    textValue: true,
                  },
                },
              },
            },
          },
        });

        console.log('Sessions: ', sessions.length);
        console.log('Pages: ', Math.ceil(pages.length / limit));
        const mappedSessions = sessions.map((session) => {
          const { id, createdAt } = session;
          const score = session.nodeEntries.find((entry) => entry.depth === 0)?.values?.[0]?.numberValue;
          const paths = session.nodeEntries.length;
          return { sessionId: id, score, paths, createdAt };
        });
        const orderedSessions = _.orderBy(mappedSessions, (session) => session.createdAt, ['desc']);
        const finalSessions = orderedSessions.map((session, index) => ({ ...session, index }));
        return {
          sessions: finalSessions, pages: Math.ceil(pages.length / limit), offset, limit, pageIndex,
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
      resolve(parent: any, args: any, ctx: any, info: any) {
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
      resolve(parent: any, args: any, ctx: any, info: any) {
        const session = SessionResolver.uploadUserSession(parent, args, ctx);
        return session;
      },
    });
  },
});

const sessionNexus = [
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
