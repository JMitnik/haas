import * as _ from 'lodash';
import { UserInputError } from 'apollo-server-express';
import { inputObjectType, mutationField } from '@nexus/schema';

import { CTALinksInputType } from '../link/Link';
import { FormNodeFieldUpsertArgs } from '@prisma/client';
import { FormNodeInputType, QuestionNodeType, ShareNodeInputType } from '.';
import { NexusGenInputs } from '../../generated/nexus';
import { QuestionNodeTypeEnum } from './QuestionNode';

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

const saveEditFormNodeInput = (input: NexusGenInputs['FormNodeInputType']): FormNodeFieldUpsertArgs[] | undefined => (
  input.fields?.map((field) => ({
    create: {
      type: field.type || 'shortText',
      label: field.label || '',
      position: field.position || -1,
      placeholder: field.placeholder || '',
      isRequired: field.isRequired || false,
    },
    update: {
      type: field.type || 'shortText',
      label: field.label || '',
      position: field.position || -1,
      placeholder: field.placeholder || '',
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
    return ctx.services.nodeService.updateCTA(args.input);
  }
});
