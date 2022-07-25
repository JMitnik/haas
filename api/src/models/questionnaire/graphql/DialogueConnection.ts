import { enumType, inputObjectType, objectType } from 'nexus';
import { ConnectionInterface } from '../../general/Pagination';

import { DialogueType } from '../Dialogue';

export const DialogueConnectionOrderByInput = inputObjectType({
  name: 'DialogueConnectionOrderByInput',
  description: 'Sorting of DialogueConnection',

  definition(t) {
    t.field('by', { type: DialogueConnectionOrderType, nullable: false });
    t.boolean('desc', { default: true, required: false });
  },
});

export const DialogueConnectionOrderType = enumType({
  name: 'DialogueConnectionOrder',
  description: 'Fields to order UserConnection by.',

  members: ['createdAt'],
});


export const DialogueConnectionFilterInput = inputObjectType({
  name: 'DialogueConnectionFilterInput',
  definition(t) {
    // Pre-filter
    t.string('searchTerm', { required: false });
    t.string('startDate', { required: false });
    t.string('endDate', { required: false });

    // Post-order
    t.field('orderBy', { type: DialogueConnectionOrderByInput });

    // Paginate
    t.int('offset', { nullable: true });
    t.int('perPage', { required: false, default: 10 });
  },
});

export const DialogueConnection = objectType({
  name: 'DialogueConnection',
  definition(t) {
    t.implements(ConnectionInterface);
    t.list.field('dialogues', { type: DialogueType });
  },
});