/* eslint-disable import/prefer-default-export */
import { PrismaClient, NodeEntry, NodeEntryValue, Session } from '@prisma/client';
import { objectType, queryType, extendType } from '@nexus/schema';

const prisma = new PrismaClient();

export const NodeEntryValueType = objectType({
  name: 'NodeEntryValue',
  definition(t) {
    t.id('id');
    t.int('numberValue', { nullable: true });
    t.string('textValue', { nullable: true });
    t.string('parentNodeEntryId');
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
    t.string('relatedEdgeId');
    t.string('relatedNodeId');
    t.string('sessionId');
    t.list.field('values', {
      type: NodeEntryValueType,
      resolve(parent: NodeEntry, args: any, ctx: any, info: any) {
        const values = prisma.nodeEntryValue.findMany({ where: { parentNodeEntryId: parent.id } });
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
