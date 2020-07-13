import { Link, PrismaClient } from '@prisma/client';
import { enumType, extendType, inputObjectType, objectType } from '@nexus/schema';

import { QuestionNodeType } from '../question/QuestionNode';

export const LinkTypeEnumType = enumType({
  name: 'LinkTypeEnumType',
  members: [
    'SOCIAL',
    'API',
    'FACEBOOK',
    'LINKEDIN',
    'WHATSAPP',
    'INSTAGRAM',
    'TWITTER'],
});

export const CTALinkInputObjectType = inputObjectType({
  name: 'CTALinkInputObjectType',
  definition(t) {
    t.string('id', { nullable: true });
    t.string('title', { nullable: true });
    t.field('type', { type: LinkTypeEnumType });
    t.string('url');
    t.string('icon', { nullable: true });
    t.string('backgroundColor', { nullable: true });
  },
});

export const CTALinksInputType = inputObjectType({
  name: 'CTALinksInputType',
  definition(t) {
    t.list.field('linkTypes', {
      type: CTALinkInputObjectType,
    });
  },
});

export const LinkType = objectType({
  name: 'LinkType',
  definition(t) {
    t.string('id');
    t.string('title', { nullable: true });
    t.string('url');
    t.string('icon', { nullable: true });
    t.string('backgroundColor', { nullable: true });
    t.string('questionNodeId');
    t.string('type');

    t.field('questionNode', {
      type: QuestionNodeType,
      async resolve(parent: Link, args: any, ctx: any) {
        const { prisma } : { prisma: PrismaClient } = ctx;
        const link = await prisma.link.findOne({
          where: {
            id: parent.id,
          },
          include: {
            questionNode: true,
          },
        });
        return link?.questionNode;
      },
    });
  },
});

export default [
  CTALinkInputObjectType,
  CTALinksInputType,
  LinkType,
  LinkTypeEnumType,
];
