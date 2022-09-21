import { enumType, inputObjectType, objectType } from 'nexus';

import { ConnectionInterface } from '../../general/Pagination';
import { ActionableType } from './Actionable.graphql';

export const ActionableConnectionOrderByInput = inputObjectType({
  name: 'ActionableConnectionOrderByInput',
  description: 'Sorting of ActionableConnection',

  definition(t) {
    t.nonNull.field('by', { type: ActionableConnectionOrderType });
    t.boolean('desc', { default: true });
  },
});

export const ActionableConnectionOrderType = enumType({
  name: 'ActionableConnectionOrderType',
  description: 'Fields to order ActionableConnection by.',

  members: ['createdAt'],
});

export const ActionableConnectionFilterInput = inputObjectType({
  name: 'ActionableConnectionFilterInput',
  definition(t) {
    // Pre-filter
    t.string('search')
    t.dateString('startDate');
    t.dateString('endDate');
    t.string('assigneeId');
    t.string('requestEmail');
    t.boolean('isVerified');
    t.string('topic');
    t.string('dialogueId');
    t.field('status', {
      type: 'ActionableState',
    });

    // Post-order
    t.field('orderBy', { type: ActionableConnectionOrderByInput });

    // Paginate
    t.nonNull.int('offset');
    t.nonNull.int('perPage', { default: 10 });
  },
});

export const ActionableConnection = objectType({
  name: 'ActionableConnection',
  definition(t) {
    t.implements(ConnectionInterface);
    t.list.field('actionables', { type: ActionableType });
  },
});