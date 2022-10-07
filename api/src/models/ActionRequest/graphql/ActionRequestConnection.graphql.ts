import { enumType, inputObjectType, objectType } from 'nexus';

import { ConnectionInterface } from '../../general/Pagination';
import { ActionRequestType } from './ActionRequest.graphql';
import { ActionRequestState } from './ActionRequestState.graphql';

export const ActionRequestConnectionOrderByInput = inputObjectType({
  name: 'ActionRequestConnectionOrderByInput',
  description: 'Sorting of ActionableConnection',

  definition(t) {
    t.nonNull.field('by', { type: ActionRequestConnectionOrderType });
    t.boolean('desc', { default: true });
  },
});

export const ActionRequestConnectionOrderType = enumType({
  name: 'ActionRequestConnectionOrderType',
  description: 'Fields to order ActionableConnection by.',

  members: ['createdAt'],
});

export const ActionRequestConnectionFilterInput = inputObjectType({
  name: 'ActionRequestConnectionFilterInput',
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
      type: ActionRequestState,
    });

    // Post-order
    t.field('orderBy', { type: ActionRequestConnectionOrderByInput });

    // Paginate
    t.nonNull.int('offset');
    t.nonNull.int('perPage', { default: 10 });
  },
});

export const ActionRequestConnection = objectType({
  name: 'ActionRequestConnection',
  definition(t) {
    t.implements(ConnectionInterface);
    t.list.field('actionRequests', { type: ActionRequestType });
  },
});