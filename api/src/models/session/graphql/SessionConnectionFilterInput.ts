import { enumType, inputObjectType } from '@nexus/schema';

export const SessionConnectionOrderByInput = inputObjectType({
  name: 'SessionConnectionOrderByInput',
  description: 'Sorting of sessionConnection',

  definition(t) {
    t.field('by', { type: SessionConnectionOrderType, nullable: false });
    t.boolean('desc', { default: true, required: false });
  },
});

export const SessionConnectionOrderType = enumType({
  name: 'SessionConnectionOrder',
  description: 'Fields to order SessionConnection by.',

  members: ['firstName', 'lastName']
});

export const SessionConnectionFilterInput = inputObjectType({
  name: 'SessionConnectionFilterInput',

  definition(t) {
    // Pre-filter
    t.string('search', { required: false });
    t.string('startDate', { required: false });
    t.string('endDate', { required: false });

    // Post-order
    t.field('orderBy', { type: SessionConnectionOrderByInput });

    // Paginate
    t.int('offset', { nullable: true });
    t.int('perPage', { required: false, default: 10 });
  }
})
