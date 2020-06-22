import { PrismaClient } from '@prisma/client';
import { enumType, extendType, inputObjectType, objectType } from '@nexus/schema';
import _ from 'lodash';

import { DialogueType } from '../questionnaire/Dialogue';

const prisma = new PrismaClient();

export const TagType = objectType({
  name: 'TagType',
  definition(t) {
    t.string('id');
    t.string('name');
    t.string('customerId');
  },
});
export const TagQueries = extendType({
  type: 'Query',
  definition(t) {
    t.list.field('tags', {
      type: TagType,
      args: {
        customerId: 'String',
      },
      resolve(parent: any, args: any, ctx: any) {
        return prisma.tag.findMany({
          where: {
            customerId: args.customerId,
          },
        });
      },
    });
  },
});

export const TagsInputType = inputObjectType({
  name: 'TagsInputObjectType',
  definition(t) {
    t.list.string('entries');
  },
});

export const TagMutations = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('assignTags', {
      type: DialogueType,
      args: {
        dialogueId: 'String',
        tags: TagsInputType,
      },
      resolve(parent: any, args: any, ctx: any) {
        const tags = args.tags.entries.length > 0 ? args.tags.entries.map((entry: string) => ({ id: entry })) : [];

        return prisma.dialogue.update({
          where: {
            id: args.dialogueId,
          },
          data: {
            tags: {
              connect: tags,
            },
          },
        });
      },
    });
    t.field('createTag', {
      type: TagType,
      args: {
        name: 'String',
        customerId: 'String',
      },
      resolve(parent: any, args: any, ctx: any) {
        return prisma.tag.create({
          data: {
            name: args.name,
            customer: {
              connect: {
                id: args.customerId,
              },
            },
          },
        });
      },
    });
  },
});
export default [
  TagType,
  TagQueries,
  TagMutations,
];
