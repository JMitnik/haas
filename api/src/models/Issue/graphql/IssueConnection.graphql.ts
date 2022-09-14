import { enumType, inputObjectType, objectType } from 'nexus';

import { ConnectionInterface } from '../../general/Pagination';
import { IssueModel } from './IssueModel.graphql';

export const IssueConnectionOrderByInput = inputObjectType({
  name: 'IssueConnectionOrderByInput',
  description: 'Sorting of IssueConnection',

  definition(t) {
    t.nonNull.field('by', { type: IssueConnectionOrderType });
    t.boolean('desc', { default: true });
  },
});

export const IssueConnectionOrderType = enumType({
  name: 'IssueConnectionOrderType',
  description: 'Fields to order IssueConnection by.',

  members: ['issue'],
});

export const IssueConnectionFilterInput = inputObjectType({
  name: 'IssueConnectionFilterInput',
  definition(t) {
    // Pre-filter
    t.string('label');
    t.string('search')
    t.string('startDate');
    t.string('endDate');

    /** Fragments of the topic which should constitute the relevant filter */
    t.list.nonNull.string('topicStrings');

    // Post-order
    t.field('orderBy', { type: IssueConnectionOrderByInput });

    // Paginate
    t.nonNull.int('offset');
    t.nonNull.int('perPage', { default: 10 });
  },
});

export const IssueConnection = objectType({
  name: 'IssueConnection',
  definition(t) {
    t.implements(ConnectionInterface);
    t.list.field('issues', { type: IssueModel });
  },
});