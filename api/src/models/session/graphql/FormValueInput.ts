import { inputObjectType } from '@nexus/schema';

import { FormNodeEntryFieldInput } from '../../node-entry/NodeEntry';

export const FormValueInput = inputObjectType({
  name: 'FormValueInput',
  description: 'Input of form values',

  definition(t) {
    t.list.field('values', { type: FormNodeEntryFieldInput });
  },
})
