import * as _ from 'lodash';
import { UserInputError } from 'apollo-server-express';
import { inputObjectType, mutationField } from '@nexus/schema';

import { CTALinksInputType } from '../link/Link';
import { FormNodeCreateInput, FormNodeFieldUpsertArgs, FormNodeUpdateInput, FormNodeUpsertWithoutQuestionNodeInput } from '@prisma/client';
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

const saveEditFormNodeInput = (input: NexusGenInputs['FormNodeInputType']): FormNodeFieldUpsertArgs[] | undefined => (
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
    return ctx.services.nodeService.updateCTA(args.input);
  }
});
