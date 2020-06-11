import { NodeEntry, NodeEntryValue, NodeEntryWhereInput, PrismaClient, Session, SessionWhereInput } from '@prisma/client';
import { extendType, inputObjectType, objectType } from '@nexus/schema';
import _ from 'lodash';

import { PaginationProps } from '../../types/generic';
import { QuestionNodeType } from '../question/QuestionNode';
import NodeEntryResolver from '../nodeentry/nodeentry-resolver';
import SessionResolver from './session-resolver';

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
        filter: FilterInput,
      },
      async resolve(parent: any, args: any) {
        const { pageIndex, offset, limit, startDate, endDate, searchTerm }: PaginationProps = args.filter;
        const dateRange = SessionResolver.constructDateRangeWhereInput(startDate, endDate);
        const orderBy = args.filter.orderBy ? Object.assign({}, ...args.filter.orderBy) : null;
        const { pageSessions, totalPages, resetPages } = await NodeEntryResolver.getCurrentInteractionSessions(
          args.where.dialogueId,
          offset,
          limit,
          pageIndex,
          orderBy,
          dateRange,
          searchTerm,
        );

        const finalSessions = pageSessions.map((session, index) => ({ ...session, index }));
        return {
          sessions: finalSessions,
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
  FilterInput,
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
