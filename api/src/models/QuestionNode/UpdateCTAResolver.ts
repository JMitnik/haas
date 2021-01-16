import * as _ from 'lodash';
import { UserInputError } from 'apollo-server-express';
import { inputObjectType, mutationField } from '@nexus/schema';

import { CTALinksInputType } from '../link/Link';
import { Prisma } from '@prisma/client';
import { FormNodeInputType, QuestionNodeType, ShareNodeInputType } from '.';
import { NexusGenInputs } from '../../generated/nexus';
import { QuestionNodeTypeEnum } from './QuestionNode';
import { findDifference } from '../../utils/findDifference';
import NodeService from './NodeService';
import prisma from '../../config/prisma';

export const UpdateCTAInputType = inputObjectType({
  name: 'UpdateCTAInputType',
  definition(t) {
    t.string('id');
    t.id('customerId');
    t.string('title');
    t.field('type', { type: QuestionNodeTypeEnum });

    t.field('links', { type: CTALinksInputType });
    t.field('share', { type: ShareNodeInputType });
    t.field('form', { type: FormNodeInputType });
  },
});

const saveEditFormNodeInput = (input: NexusGenInputs['FormNodeInputType']): Prisma.FormNodeFieldUpsertArgs[] | undefined => (
  input.fields?.map((field) => ({
    create: {
      type: field.type || 'shortText',
      label: field.label || 'Generic',
      position: field.position || -1,
      isRequired: field.isRequired || false,
    },
    update: {
      type: field.type || 'shortText',
      label: field.label || 'Generic',
      position: field.position || -1,
      isRequired: field.isRequired || false,
    },
    where: {
      id: field.id || '-1',
    },
  })) || undefined
);

export const UpdateCTAResolver = mutationField('updateCTA', {
  type: QuestionNodeType,
  args: { input: UpdateCTAInputType },

  async resolve(parent, args, ctx) {
    if (!args.input?.id) throw new UserInputError('No ID Found');

    const existingNode = await ctx.prisma.questionNode.findUnique({
      where: { id: args?.input?.id || undefined },
      include: {
        links: true,
        share: true,
        form: {
          include: {
            fields: true,
          },
        },
      },
    });

    // If a share was previously on the node, but not any longer the case, disconnect it.
    if (existingNode?.share && (!args?.input?.share || args?.input?.type !== 'SHARE')) {
      await ctx.prisma.share.delete({ where: { id: existingNode.share.id } });
    }

    // If type is share, create a share connection (or update it)
    if (args?.input?.share && args?.input?.type === 'SHARE') {
      await prisma.share.upsert({
        where: {
          id: args?.input?.share.id || '-1',
        },
        create: {
          title: args?.input?.share.title || '',
          url: args?.input?.share.url || '',
          tooltip: args?.input?.share.tooltip,
          questionNode: {
            connect: {
              id: existingNode?.id,
            },
          },
        },
        update: {
          title: args?.input?.share.title || '',
          url: args?.input?.share.url || '',
          tooltip: args?.input?.share.tooltip,
        },
      });
    }

    // If we have links associated, remove "non-existing links"
    if (existingNode?.links && args?.input?.links?.linkTypes?.length) {
      await NodeService.removeNonExistingLinks(existingNode?.links, args?.input?.links?.linkTypes);
    }

    // Upsert links in g eneral
    if (args?.input?.links?.linkTypes?.length) {
      await NodeService.upsertLinks(args?.input?.links?.linkTypes, args?.input?.id);
    }

    // If form is passed
    if (args?.input?.form) {
      const removedFields = findDifference(existingNode?.form?.fields, args?.input?.form?.fields);

      if (removedFields.length) {
        await prisma.questionNode.update({
          where: { id: args?.input?.id },
          data: {
            form: {
              update: {
                fields: {
                  disconnect: removedFields.map((field) => ({ id: field?.id?.toString() || '' })),
                },
              },
            },
          },
        });
      }

      if (existingNode?.form) {
        await prisma.questionNode.update({
          where: { id: args?.input?.id },
          data: {
            form: {
              update: {
                fields: {
                  upsert: saveEditFormNodeInput(args.input.form),
                },
              },
            },
          },
        });
      } else {
        await prisma.questionNode.update({
          where: { id: args?.input?.id },
          data: {
            form: {
              create: NodeService.saveCreateFormNodeInput(args.input.form),
            },
          },
        });
      }
    }

    // Finally, update question-node
    return prisma.questionNode.update({
      where: { id: args?.input?.id },
      data: {
        title: args?.input?.title || '',
        type: args.input.type || 'GENERIC',
      },
    });
  },
});
