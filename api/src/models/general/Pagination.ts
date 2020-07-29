import { enumType, inputObjectType, interfaceType, objectType } from '@nexus/schema';

const PaginationSortByEnum = enumType({
  name: 'PaginationSortByEnum',
  description: 'Ways to sort a pagination object',
  // TODO: Make this enum overrideable?
  members: ['score', 'id', 'createdAt', 'email', 'name', 'firstName', 'lastName', 'role', 'medium', 'type', 'paths', 'user', 'when'],
});

// TODO: Can we make this a generic type
export const PaginationSortInput = inputObjectType({
  name: 'PaginationSortInput',
  description: 'Sorting of pagination (type and whether it ascends)',

  definition(t) {
    t.field('by', { type: PaginationSortByEnum, nullable: false });
    t.boolean('desc', { default: true, required: false });
  },
});

export const PaginationPageInfo = objectType({
  name: 'PaginationPageInfo',
  description: 'Information with regards to current page, and total number of pages',

  definition(t) {
    t.int('nrPages');
    t.int('pageIndex');
  },
});

export const ConnectionInterface = interfaceType({
  name: 'ConnectionInterface',
  description: 'Interface all pagination-based models should implement',

  definition(t) {
    t.resolveType(() => null);

    // TODO: Replace by cursor
    t.int('offset');
    t.int('limit');

    t.field('pageInfo', { type: PaginationPageInfo });

    t.string('startDate', { nullable: true });
    t.string('endDate', { nullable: true });
  },
});

export const PaginationWhereInput = inputObjectType({
  name: 'PaginationWhereInput',

  definition(t) {
    t.string('startDate', { required: false });
    t.string('endDate', { required: false });

    t.int('offset', { required: false });
    t.int('limit', { required: false });
    t.int('pageIndex', { required: false });

    // TODO: Rename to search
    t.string('searchTerm', { required: false });
    t.string('search', { required: false });

    t.list.field('orderBy', {
      type: PaginationSortInput,
    });
  },
});

