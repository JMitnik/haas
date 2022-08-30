import { enumType, inputObjectType, objectType } from 'nexus';

import { AutomationModel } from '..';
import { ConnectionInterface } from '../../general/Pagination';
import { AutomationType } from './AutomationType';

export const AutomationConnectionOrderByInput = inputObjectType({
  name: 'AutomationConnectionOrderByInput',
  description: 'Sorting of UserConnection',

  definition(t) {
    t.nonNull.field('by', { type: AutomationConnectionOrderType });
    t.boolean('desc', { default: true });
  },
});

export const AutomationConnectionOrderType = enumType({
  name: 'AutomationConnectionOrderType',
  description: 'Fields to order UserConnection by.',

  members: ['updatedAt', 'type', 'createdAt'],
});

export const AutomationConnectionFilterInput = inputObjectType({
  name: 'AutomationConnectionFilterInput',
  definition(t) {
    // Pre-filter
    t.string('label');
    t.string('search')
    t.field('type', { type: AutomationType });

    // Post-order
    t.field('orderBy', { type: AutomationConnectionOrderByInput });

    // Paginate
    t.int('offset');
    t.int('perPage', { default: 10 });
  },
});

export const AutomationConnection = objectType({
  name: 'AutomationConnection',
  definition(t) {
    t.implements(ConnectionInterface);
    t.list.field('automations', { type: AutomationModel });
  },
});