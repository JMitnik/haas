import { enumType, inputObjectType, interfaceType, objectType } from 'nexus';

const PaginationSortByEnum = enumType({
  name: 'PaginationSortByEnum',
  description: 'Ways to sort a pagination object',
  // TODO: Make this enum overrideable?
  members: [
    'score', 'id', 'createdAt', 'email',
    'name', 'firstName', 'lastName', 'role',
    'medium', 'type', 'paths', 'user', 'when',
    'scheduledAt', 'updatedAt',
  ],
});

export const PaginationSearchEnum = enumType({
  name: 'PaginationSearchEnum',
  description: 'Fields that can be used for free text search on tables',
  // TODO: Make this enum overrideable?
  members: ['name', 'firstName', 'lastName', 'email', 'title', 'publicTitle'],
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

export const DeprecatedPaginationPageInfo = objectType({
  name: 'DeprecatedPaginationPageInfo',
  description: 'Information with regards to current page, and total number of pages',

  definition(t) {
    t.string('cursor', { nullable: true });

    t.int('nrPages');
    t.int('pageIndex');
  },
});

export const PaginationPageInfo = objectType({
  name: 'PaginationPageInfo',
  description: 'Information with regards to current page.',

  definition(t) {
    t.boolean('hasPrevPage');
    t.boolean('hasNextPage');
    t.int('prevPageOffset');
    t.int('nextPageOffset');
    t.int('pageIndex');
  },
});

export const DeprecatedConnectionInterface = interfaceType({
  name: 'DeprecatedConnectionInterface',
  description: 'Interface all pagination-based models should implement',
  resolveType: () => null,
  definition(t) {
    // TODO: Replace by cursor
    t.string('cursor', { nullable: true });
    t.int('offset', { nullable: true });
    t.int('limit');

    t.field('pageInfo', { type: DeprecatedPaginationPageInfo });

    t.string('startDate', { nullable: true });
    t.string('endDate', { nullable: true });
  },
});

export const ConnectionInterface = interfaceType({
  name: 'ConnectionInterface',
  description: 'Interface all pagination-based models should implement',
  resolveType: () => null,
  definition(t) {
    t.int('totalPages', { nullable: true });

    t.field('pageInfo', { type: PaginationPageInfo });
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
    t.string('cursor', { required: false });

    t.list.field('orderBy', {
      type: PaginationSortInput,
    });
  },
});

