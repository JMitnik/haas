import { NexusGenEnums, NexusGenInputs, NexusGenRootTypes } from '../../generated/nexus';
import { Object } from 'lodash';
import { TriggerWhereInput } from '@prisma/client';

export const slice = (
  entries: Array<any>,
  offset: number,
  limit: number,
  pageIndex: number,
) => ((offset + limit) < entries.length
  ? entries.slice(offset, (pageIndex + 1) * limit)
  : entries.slice(offset, entries.length));

export const orderBy = (callback: (list: Array<any>, orderBy: { id: string, desc: boolean }) => Array<any>) => callback;

export const getSearchTermFilter = (searchFields: NexusGenEnums['PaginationSearchEnum'][], searchTerm: string) => {
  if (!searchTerm || !searchFields.length) {
    return [];
  }

  const searchTermFilter: Array<any> = searchFields.map(
    (searchField) => ({ [searchField]: { contains: searchTerm, mode: 'insensitive' } }),
  );

  console.log('search term filter: ', searchTermFilter);

  return searchTermFilter;
};

export const constructWhereInput = (
  whereInput: any,
  paginationOpts: NexusGenInputs['PaginationWhereInput'],
  searchFields: NexusGenEnums['PaginationSearchEnum'][],
) => {
  // Build filter

  const searchTermFilter = getSearchTermFilter(searchFields, paginationOpts.search || '');
  whereInput.OR = searchTermFilter.length ? searchTermFilter : undefined;

  return whereInput;
};

export const constructSortInput = (
  orderFields: NexusGenEnums['PaginationSortByEnum'][],
  orderByArray?: NexusGenInputs['PaginationSortInput'][],
) => {
  if (!orderByArray?.length) return undefined;

  const orderBy = orderByArray[0];
  const sortObject: Record<any, string> = {};

  orderFields.forEach((sortOption) => {
    const sortCondition = orderBy.by === sortOption ? orderBy.desc ? 'desc' : 'asc' : undefined;
    if (sortCondition) {
      sortObject[sortOption] = sortCondition;
    }
  });

  console.log('constructed sort input: ', sortObject);

  return sortObject;
};

type findManyInput = {
  where: any,
  take?: number | undefined,
  skip?: number | undefined,
  orderBy?: any,
};

type TableProps = {
  findMany: (findManyProps: findManyInput) => Promise<Array<any>>,
  count: (countWhereProps: any) => Promise<number>,
};

export const constructFindManyInput = (
  whereInput: any,
  paginationOpts: NexusGenInputs['PaginationWhereInput'],
  searchFields: NexusGenEnums['PaginationSearchEnum'][],
  orderFields: NexusGenEnums['PaginationSortByEnum'][],
): findManyInput => {
  const where = constructWhereInput(whereInput, paginationOpts, searchFields);
  const orderBy = constructSortInput(orderFields, paginationOpts.orderBy || undefined);

  return { orderBy, where, skip: paginationOpts.offset || undefined, take: paginationOpts.limit || undefined };
};

export const paginate = async (
  table: TableProps,
  findManyWhereInput: any,
  searchFields: NexusGenEnums['PaginationSearchEnum'][],
  paginationOpts: NexusGenInputs['PaginationWhereInput'],
  orderFields: NexusGenEnums['PaginationSortByEnum'][],
  countWhereInput: any,
) => {
  const findManyInput = constructFindManyInput(findManyWhereInput, paginationOpts, searchFields, orderFields);
  const entries = await table.findMany(findManyInput);
  const triggerTotal = await table.count(countWhereInput);
  const totalPages = paginationOpts.limit ? Math.ceil(triggerTotal / (paginationOpts.limit)) : 1;
  const currentPage = paginationOpts.pageIndex && paginationOpts.pageIndex <= totalPages
    ? paginationOpts.pageIndex : 1;

  const pageInfo: NexusGenRootTypes['PaginationPageInfo'] = {
    nrPages: totalPages,
    pageIndex: currentPage,
  };

  return {
    entries,
    pageInfo,
  };
};
