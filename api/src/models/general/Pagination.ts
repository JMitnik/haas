import { inputObjectType, interfaceType } from '@nexus/schema';

// TODO: Can we make this a generic type
export const PaginationSortInput = inputObjectType({
  name: 'PaginationSortInput',

  definition(t) {
    t.string('id', { required: false });
    t.boolean('desc', { required: false });
  },
});

export const ConnectionInterface = interfaceType({
  name: 'ConnectionInterface',

  definition(t) {
    t.int('pages');
    t.int('pageIndex');
    t.int('pageSize');
    t.string('startDate', { nullable: true });
    t.string('endDate', { nullable: true });

    // t.list.field('orderBy', { type: 'PaginationSortInput' });
  },
});

export const PaginationWhereInput = inputObjectType({
  name: 'PaginationWhereInput',

  definition(t) {
    t.string('startDate', { required: false });
    t.string('endDate', { required: false });
    t.string('search', { required: false });
    t.int('offset', { required: false });
    t.int('limit', { required: false });
    t.int('pageIndex', { required: false });

    t.list.field('orderBy', {
      type: PaginationSortInput,
      required: false,
    });
  },
});

