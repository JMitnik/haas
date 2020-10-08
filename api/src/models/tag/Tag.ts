import { UserInputError } from 'apollo-server-express';
import { enumType, extendType, inputObjectType, objectType } from '@nexus/schema';

// eslint-disable-next-line import/no-cycle
import { CustomerType } from '../customer/Customer';
// eslint-disable-next-line import/no-cycle
import { DialogueType } from '../questionnaire/Dialogue';

export const TagTypeEnum = enumType({
  name: 'TagTypeEnum',
  members: ['DEFAULT', 'LOCATION', 'AGENT'],
});

export const TagType = objectType({
  name: 'Tag',

  definition(t) {
    t.id('id');
    t.string('name');

    t.string('customerId');

    t.field('type', { type: TagTypeEnum });
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

      async resolve(parent, args, ctx) {
        if (args.dialogueId) {
          const tags = await ctx.prisma.tag.findMany({
            where: {
              isTagOf: { some: { id: args.dialogueId } },
            },
          });

          return tags;
        }

        if (args.customerSlug) {
          const customer = await ctx.prisma.customer.findOne({
            where: { slug: args.customerSlug },
            include: {
              tags: true,
            },
          });

          return customer?.tags || [];
        }

        throw new UserInputError('Provide a dialogue id or customer slug to find tags');
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
      resolve(parent, args, ctx) {
        if (!args.dialogueId) throw new UserInputError('No dialogue provided to assign to tags');

        const tags = args.tags?.entries?.map((entryId) => ({ id: entryId })) || [];

        return ctx.prisma.dialogue.update({
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
      async resolve(parent, args, ctx) {
        if (!args.customerSlug) throw new UserInputError('No customer slug provided for which tag to create');

        const customer = await ctx.prisma.customer.findOne({
          where: { slug: args.customerSlug },
        });

        return ctx.prisma.tag.create({
          data: {
            name: args.name || '',
            type: args.type || 'DEFAULT',
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
      resolve(parent, args, ctx) {
        if (!args.tagId) throw new UserInputError('No valid tag id provided');

        return ctx.prisma.tag.delete({ where: { id: args.tagId } });
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
