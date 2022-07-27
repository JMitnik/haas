import { NexusGenInputs } from '../../../generated/nexus';
import { PaginateProps, paginate } from './pagination';


const TWO_PAGE_PAGINATE_ENTRIES = ['One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten'];

const findMany = async () => {
  return TWO_PAGE_PAGINATE_ENTRIES;
};

const countEntries = async () => TWO_PAGE_PAGINATE_ENTRIES.length;

describe('Pagination', () => {
  test('Retrieve data equal to limit for first page', async () => {
    const paginationOpts: NexusGenInputs['PaginationWhereInput'] = {
      limit: 8,
      offset: 0,
      pageIndex: 0,
    }

    const paginateProps: PaginateProps = {
      findManyArgs: {
        findArgs: null,
        searchFields: [],
        orderFields: [],
        findManyCallBack: findMany,
      },
      countArgs: {
        countWhereInput: null,
        countCallBack: countEntries,
      },
      paginationOpts,
    };

    const { entries, pageInfo } = await paginate(paginateProps);
    expect(entries).toHaveLength(8);
    expect(entries[0]).toBe('One');
    expect(entries[entries.length - 1]).toBe('Eight');
    expect(pageInfo.nrPages).toBe(2);
    expect(pageInfo.pageIndex).toBe(0);
  });

  test('Paginate to second page with amount less than limit', async () => {
    // Show second page with max 8 entries
    const paginationOpts: NexusGenInputs['PaginationWhereInput'] = {
      limit: 8,
      offset: 8,
      pageIndex: 1,
    }

    const paginateProps: PaginateProps = {
      findManyArgs: {
        findArgs: null,
        searchFields: [],
        orderFields: [],
        findManyCallBack: findMany,
      },
      countArgs: {
        countWhereInput: null,
        countCallBack: countEntries,
      },
      paginationOpts,
    };

    const { entries, pageInfo } = await paginate(paginateProps);
    expect(entries).toHaveLength(2);
    expect(entries[0]).toBe('Nine');
    expect(entries[entries.length - 1]).toBe('Ten');
    expect(pageInfo.nrPages).toBe(2);
    expect(pageInfo.pageIndex).toBe(1);
  });

  test('Less than limit amount of entries', async () => {
    const TWO_ENTRIES_PAGINATE = ['One', 'Two'];

    const findMany = async () => TWO_ENTRIES_PAGINATE;
    const countMany = async () => TWO_ENTRIES_PAGINATE.length;

    const paginationOpts: NexusGenInputs['PaginationWhereInput'] = {
      limit: 8,
      offset: 8,
      pageIndex: 0,
    }

    const paginateProps: PaginateProps = {
      findManyArgs: {
        findArgs: null,
        searchFields: [],
        orderFields: [],
        findManyCallBack: findMany,
      },
      countArgs: {
        countWhereInput: null,
        countCallBack: countMany,
      },
      paginationOpts,
    };

    const { entries, pageInfo } = await paginate(paginateProps);
    expect(entries).toHaveLength(2);
    expect(entries[0]).toBe('One');
    expect(entries[entries.length - 1]).toBe('Two');
    expect(pageInfo.nrPages).toBe(1);
    expect(pageInfo.pageIndex).toBe(0);
  });

  test('Paginate to second page with same amount as limit', async () => {
    const paginationOpts: NexusGenInputs['PaginationWhereInput'] = {
      limit: 5,
      offset: 5,
      pageIndex: 1,
    }

    const paginateProps: PaginateProps = {
      findManyArgs: {
        findArgs: null,
        searchFields: [],
        orderFields: [],
        findManyCallBack: findMany,
      },
      countArgs: {
        countWhereInput: null,
        countCallBack: countEntries,
      },
      paginationOpts,
    };

    const { entries, pageInfo } = await paginate(paginateProps);
    expect(entries).toHaveLength(5);
    expect(entries[0]).toBe('Six');
    expect(entries[entries.length - 1]).toBe('Ten');
    expect(pageInfo.nrPages).toBe(2);
    expect(pageInfo.pageIndex).toBe(1);
  });
});
