import { Object } from 'lodash';
import { TriggerWhereInput } from '@prisma/client';
import { NexusGenEnums, NexusGenInputs } from '../../generated/nexus';

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
  findManyCallback: (findManyProps: findManyInput) => Promise<Array<any>>,
  whereInput: any,
  searchFields: NexusGenEnums['PaginationSearchEnum'][],
  paginationOpts: NexusGenInputs['PaginationWhereInput'],
  orderFields: NexusGenEnums['PaginationSortByEnum'][],
) => {
  const findManyInput = constructFindManyInput(whereInput, paginationOpts, searchFields, orderFields);
  return findManyCallback(findManyInput);
};
