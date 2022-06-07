import { enumType, inputObjectType, objectType } from '@nexus/schema';

import { AutomationModel } from '..';
import { ConnectionInterface } from '../../general/Pagination';
import { AutomationType } from './AutomationType';

export const AutomationConnectionOrderByInput = inputObjectType({
  name: 'AutomationConnectionOrderByInput',
  description: 'Sorting of UserConnection',

  definition(t) {
    t.field('by', { type: AutomationConnectionOrderType, nullable: false });
    t.boolean('desc', { default: true, required: false });
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
    t.string('label', { required: false });
    t.string('search', { nullable: true })
    t.field('type', { type: AutomationType, required: false });

    // Post-order
    t.field('orderBy', { type: AutomationConnectionOrderByInput });

    // Paginate
    t.int('offset', { nullable: true });
    t.int('perPage', { required: false, default: 10 });
  },
});

export const AutomationConnection = objectType({
  name: 'AutomationConnection',
  definition(t) {
    t.implements(ConnectionInterface);
    t.list.field('automations', { type: AutomationModel });
  },
});