import { UserInputError } from 'apollo-server-express';
import { inputObjectType, mutationField } from '@nexus/schema';

import { CTALinksInputType } from '../link/Link';
import { FormNodeInputType, QuestionNodeType, ShareNodeInputType } from '.';
import { QuestionNodeTypeEnum } from './QuestionNode';
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

export const UpdateCTAResolver = mutationField('updateCTA', {
  type: QuestionNodeType,
  args: { input: UpdateCTAInputType },

  async resolve(parent, args, ctx) {
    if (!args.input?.id) throw new UserInputError('No ID Found');
    const qNode = await ctx.prisma.questionNode.findOne({
      where: { id: args?.input?.id || undefined },
      include: {
        links: true,
        share: true,
      },
    });

    // If a share was previously on the node, but not any longer the case, disconnect it.
    if (qNode?.share && (!args?.input?.share || args?.input?.type !== 'SHARE')) {
      await ctx.prisma.share.delete({ where: { id: qNode.share.id } });
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
              id: qNode?.id,
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
    if (qNode?.links && args?.input?.links?.linkTypes?.length) {
      await NodeService.removeNonExistingLinks(qNode?.links, args?.input?.links?.linkTypes);
    }

    // Upsert links in g eneral
    if (args?.input?.links?.linkTypes?.length) {
      await NodeService.upsertLinks(args?.input?.links?.linkTypes, args?.input?.id);
    }

    // If form is passed
    if (args?.input?.form) {
      // await prisma.
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
