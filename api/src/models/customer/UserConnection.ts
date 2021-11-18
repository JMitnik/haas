import { enumType, inputObjectType } from '@nexus/schema';

export const UserConnectionOrderByInput = inputObjectType({
  name: 'UserConnectionOrderByInput',
  description: 'Sorting of UserConnection',

  definition(t) {
    t.field('by', { type: UserConnectionOrderType, nullable: false });
    t.boolean('desc', { default: true, required: false });
  },
});

export const UserConnectionOrderType = enumType({
  name: 'UserConnectionOrder',
  description: 'Fields to order UserConnection by.',

  members: ['firstName', 'lastName', 'email', 'createdAt']
});


export const UserConnectionFilterInput = inputObjectType({
  name: 'UserConnectionFilterInput',
  definition(t) {
    // Pre-filter
    t.string('search', { required: false });
    t.string('startDate', { required: false });
    t.string('endDate', { required: false });
    t.string('firstName', { required: false });
    t.string('lastName', { required: false });
    t.string('email', { required: false });
    t.string('role', { required: false });

    // Post-order
    t.field('orderBy', { type: UserConnectionOrderByInput });

    // Paginate
    t.int('offset', { nullable: true });
    t.int('perPage', { required: false, default: 10 });
  }
});