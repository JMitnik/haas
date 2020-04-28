/* eslint-disable import/prefer-default-export */
import { PrismaClient, NodeEntry, NodeEntryValue, Session } from '@prisma/client';
import { objectType, queryType, extendType, inputObjectType } from '@nexus/schema';
import SessionResolver from './session-resolver';

const prisma = new PrismaClient();

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
        const multiValues = prisma.nodeEntryValue.findMany({ where: { parentNodeEntryValueId: parent.id } });
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
    t.list.field('values', {
      type: NodeEntryValueType,
      resolve(parent: NodeEntry, args: any, ctx: any, info: any) {
        const values = prisma.nodeEntryValue.findMany({ where: { nodeEntryId: parent.id } });
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
        const nodeEntries = prisma.nodeEntry.findMany({
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
    t.string('questionnaireId', { required: true });
    t.list.field('entries', {
      type: UserSessionEntryInput,
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
