import { PrismaClient } from '@prisma/client';
import { enumType, extendType, inputObjectType, objectType } from '@nexus/schema';

// eslint-disable-next-line import/no-cycle
import { DialogueType } from '../questionnaire/Dialogue';

const prisma = new PrismaClient();

export const TagType = objectType({
  name: 'TagType',
  definition(t) {
    t.string('id');
    t.string('name');
    t.string('customerId');
    t.string('type');
  },
});

export const TagQueries = extendType({
  type: 'Query',
  definition(t) {
    t.list.field('tags', {
      type: TagType,
      args: {
        customerSlug: 'String',
        dialogueId: 'String',
      },
      async resolve(parent: any, args: any) {
        if (args.dialogueId) {
          const tags = await prisma.tag.findMany({
            where: {
              isTagOf: {
                some: {
                  id: args.dialogueId,
                },
              },
            },
          });

          return tags;
        }

        const customer = await prisma.customer.findOne({
          where: { slug: args.customerSlug },
          include: {
            tags: true,
          },
        });

        return customer?.tags;
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

export const TagTypeEnum = enumType({
  name: 'TagTypeEnum',
  members: ['DEFAULT', 'LOCATION', 'AGENT'],
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
      resolve(parent: any, args: any) {
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
        customerSlug: 'String',
        type: TagTypeEnum,
      },
      async resolve(parent: any, args: any) {
        if (!args.customerSlug) {
          return null;
        }

        const customer = await prisma.customer.findOne({
          where: { slug: args.customerSlug },
        });

        return prisma.tag.create({
          data: {
            name: args.name,
            type: args.type,
            customer: {
              connect: {
                id: customer?.id,
              },
            },
          },
        });
      },
    });

    t.field('deleteTag', {
      type: TagType,
      args: {
        tagId: 'String',
      },
      resolve(parent: any, args: any) {
        return prisma.tag.delete({ where: { id: args.tagId } });
      },
    });
  },
});

export default [
  TagType,
  TagTypeEnum,
  TagsInputType,
  TagQueries,
  TagMutations,
];
