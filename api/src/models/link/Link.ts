import { enumType, inputObjectType, objectType } from 'nexus';

import { QuestionNodeType } from '../QuestionNode/QuestionNode';

export const LinkTypeEnumType = enumType({
  name: 'LinkTypeEnumType',
  members: [
    'SINGLE',
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
    t.string('url');
    t.field('type', { type: LinkTypeEnumType });

    t.string('id', { nullable: true });
    t.string('title', { nullable: true });
    t.string('iconUrl', { nullable: true });
    t.string('backgroundColor', { nullable: true });
    t.string('header', { nullable: true });
    t.string('subHeader', { nullable: true });
    t.string('buttonText', { nullable: true });
    t.string('imageUrl', { nullable: true });
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
    t.nonNull.string('id');
    t.nonNull.string('url');
    t.string('questionNodeId', { nullable: true });
    t.nonNull.string('type');

    t.string('title', { nullable: true });
    t.string('iconUrl', { nullable: true });
    t.string('backgroundColor', { nullable: true });
    t.string('header', { nullable: true });
    t.string('subHeader', { nullable: true });
    t.string('buttonText', { nullable: true });
    t.string('imageUrl', { nullable: true });

    t.field('questionNode', {
      type: QuestionNodeType,
      async resolve(parent, args, ctx) {
        if (!parent.id) return null;

        const questionNode = await ctx.services.nodeService.findNodeByLinkId(parent.id);

        if (!questionNode) throw new Error('Unable to find related node');

        return questionNode;
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
