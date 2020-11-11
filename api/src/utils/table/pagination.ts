import { Object } from 'lodash';
import { TriggerWhereInput } from '@prisma/client';
import { NexusGenEnums, NexusGenInputs, NexusGenRootTypes } from '../../generated/nexus';

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

export type findManyInput = {
  where: any,
  take?: number | undefined,
  skip?: number | undefined,
  orderBy?: any,
  include?: any,
};

type TableProps = {
  findMany: (findManyProps: findManyInput) => Promise<Array<any>>,
  count: (countWhereProps: any) => Promise<number>,
};

export const constructFindManyInput = (
  findManyArgs: ConstructFindManyProps,
): findManyInput => {
  const { findArgs, orderFields, searchFields, paginationOpts } = findManyArgs;
  const { where: findManyWhereArgs, include } = findArgs;
  const where = constructWhereInput(findManyWhereArgs, paginationOpts, searchFields);
  const orderBy = constructSortInput(orderFields, paginationOpts.orderBy || undefined);

  return {
    orderBy,
    where,
    include,
    skip: paginationOpts.offset || undefined,
    take: paginationOpts.limit || undefined,
  };
};

export interface FindManyProps {
  findArgs: any;
  searchFields: NexusGenEnums['PaginationSearchEnum'][];
  orderFields: NexusGenEnums['PaginationSortByEnum'][];
}

export interface ConstructFindManyProps extends FindManyProps {
  paginationOpts: NexusGenInputs['PaginationWhereInput'];
}

export interface FindManyCallBackProps {
  props: findManyInput,
  paginationOpts?: NexusGenInputs['PaginationWhereInput'],
  rest?: any
}

export interface FindManyArgsProps {
  findArgs: any;
  searchFields: NexusGenEnums['PaginationSearchEnum'][];
  orderFields: NexusGenEnums['PaginationSortByEnum'][];
  findManyCallBack: (
    args: FindManyCallBackProps
  ) => Promise<Array<any>>;
  [k : string]: any;
}

export interface CountArgsProps {
  countWhereInput: any;
  countCallBack: (props: findManyInput) => Promise<number>;
}

export interface PaginateProps {
  findManyArgs: FindManyArgsProps;
  paginationOpts: NexusGenInputs['PaginationWhereInput'];
  countArgs: CountArgsProps;
}

export const paginate = async ({
  findManyArgs,
  paginationOpts,
  countArgs,
} : PaginateProps,
) => {
  const { offset, limit, pageIndex } = paginationOpts;
  const { countCallBack, countWhereInput } = countArgs;
  const { findArgs, findManyCallBack, orderFields, searchFields, ...rest } = findManyArgs;
  const findManyInput = constructFindManyInput({ ...findManyArgs, paginationOpts });
  const entries = await findManyArgs.findManyCallBack({ props: findManyInput, paginationOpts, rest });
  const triggerTotal = await countCallBack(countWhereInput);
  const totalPages = paginationOpts.limit ? Math.ceil(triggerTotal / (paginationOpts.limit)) : 1;
  const currentPage = paginationOpts.pageIndex && paginationOpts.pageIndex <= totalPages
    ? paginationOpts.pageIndex : 1;

  const slicedEntries = slice(entries, (offset || 0), (limit || 0), (pageIndex || 0));

  const pageInfo: NexusGenRootTypes['PaginationPageInfo'] = {
    nrPages: totalPages,
    pageIndex: currentPage,
  };

  return {
    entries: slicedEntries,
    pageInfo,
  };
};
