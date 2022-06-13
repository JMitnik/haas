import * as _ from 'lodash';
import { UserInputError } from 'apollo-server-express';
import { inputObjectType, mutationField } from '@nexus/schema';

import { CTALinksInputType } from '../link/Link';
import { FormNodeInputType, QuestionNodeType, ShareNodeInputType } from '.';
import { QuestionNodeTypeEnum } from './QuestionNode';

export const UpdateCTAInputType = inputObjectType({
  name: 'UpdateCTAInputType',
  definition(t) {
    t.string('id');
    t.id('customerId');
    t.string('customerSlug', { required: true });
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
    return ctx.services.nodeService.updateCTA(args.input);
  },
});
