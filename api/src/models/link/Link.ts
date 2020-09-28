import { enumType, inputObjectType, objectType } from '@nexus/schema';

// eslint-disable-next-line import/no-cycle
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
    'TWITTER',
    'SHARE'],
});

export const CTALinkInputObjectType = inputObjectType({
  name: 'CTALinkInputObjectType',
  definition(t) {
    t.string('url');
    t.field('type', { type: LinkTypeEnumType });

    t.string('id', { nullable: true });
    t.string('title', { nullable: true });
    t.string('iconUrl', { nullable: true });
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
    t.string('url');
    t.string('questionNodeId', { nullable: true });
    t.string('type');

    t.string('title', { nullable: true });
    t.string('iconUrl', { nullable: true });
    t.string('backgroundColor', { nullable: true });

    t.field('questionNode', {
      type: QuestionNodeType,
      async resolve(parent, args, ctx) {
        const link = await ctx.prisma.link.findOne({
          where: { id: parent.id },
          include: { questionNode: true },
        });

        if (!link?.questionNode) throw new Error('Unable to find related node');

        return link?.questionNode as any;
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
