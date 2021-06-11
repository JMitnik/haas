import { UserInputError } from 'apollo-server-express';
import { enumType, extendType, inputObjectType, objectType } from '@nexus/schema';

// eslint-disable-next-line import/no-cycle
import { CustomerType } from '../customer/Customer';
// eslint-disable-next-line import/no-cycle
import { DialogueType } from '../questionnaire/Dialogue';
import { TagEnum } from '@prisma/client';

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
          const tags = await ctx.services.tagService.getAllTagsOfDialogue(args.dialogueId);

          return tags;
        }

        if (args.customerSlug) {
          const tags = await ctx.services.tagService.getAllTagsByCustomerSlug(args.customerSlug);

          return tags || [];
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
        return ctx.services.dialogueService.updateTags(args.dialogueId, args.tags?.entries);
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
        const validatedType = Object.values(TagEnum).find((tagType) => tagType === args.type);
        if (!args.customerSlug || !args.name || !validatedType) throw new UserInputError('Not enough inpt data to create tag!');
        return ctx.services.tagService.createTag(args.customerSlug, args.name, validatedType);
      },
    });

    t.field('deleteTag', {
      type: TagType,
      args: {
        tagId: 'String',
      },
      resolve(parent, args, ctx) {
        if (!args.tagId) throw new UserInputError('No valid tag id provided');

        return ctx.services.tagService.deleteTag(args.tagId);
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
