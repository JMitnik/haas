import { NexusGenEnums, NexusGenInputs, NexusGenRootTypes } from '../../generated/nexus';

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
  countCallBack: (args: FindManyCallBackProps) => Promise<number>;
  [k : string]: any;
}

export interface PaginateProps {
  findManyArgs: FindManyArgsProps;
  countArgs: CountArgsProps;
  paginationOpts?: NexusGenInputs['PaginationWhereInput'];
  useSlice?: boolean;
}

export type findManyInput = {
  where: any,
  take?: number | undefined,
  skip?: number | undefined,
  orderBy?: any,
  include?: any,
};

export const slice = (
  entries: Array<any>,
  offset: number,
  limit: number,
  pageIndex: number,
) => ((offset + limit) < entries.length
  ? entries.slice(offset, (pageIndex + 1) * limit)
  : entries); // .slice(offset, entries.length)

export const getSearchTermFilter = (searchFields: NexusGenEnums['PaginationSearchEnum'][], searchTerm: string) => {
  if (!searchTerm || !searchFields.length) {
    return [];
  }

  const searchTermFilter: Array<any> = searchFields.map(
    (searchField) => ({ [searchField]: { contains: searchTerm, mode: 'insensitive' } }),
  );

  return searchTermFilter;
};

export const constructWhereInput = (
  whereInput: any,
  paginationOpts: NexusGenInputs['PaginationWhereInput'],
  searchFields: NexusGenEnums['PaginationSearchEnum'][],
) => {
  const searchTermFilter = getSearchTermFilter(searchFields, paginationOpts.search || '');
  whereInput.OR = searchTermFilter.length ? searchTermFilter : undefined;

  return whereInput;
};

export const constructSortInput = (
  orderFields: NexusGenEnums['PaginationSortByEnum'][],
  orderByArray?: NexusGenInputs['PaginationSortInput'][],
) => {
  if (!orderByArray?.length) return undefined;

  const orderBy = orderByArray?.[0];
  if (!orderBy) return null;

  const sortObject: Record<any, string> = {};

  orderFields.forEach((sortOption) => {
    const sortCondition = orderBy.by === sortOption ? orderBy.desc ? 'desc' : 'asc' : undefined;
    if (sortCondition) {
      sortObject[sortOption] = sortCondition;
    }
  });

  return sortObject;
};

export const constructFindManyInput = (
  findManyArgs: ConstructFindManyProps,
): findManyInput => {
  const { findArgs, orderFields, searchFields, paginationOpts } = findManyArgs;
  const where = findArgs?.where ? constructWhereInput(findArgs?.where, paginationOpts, searchFields) : null;
  const orderBy = constructSortInput(orderFields, paginationOpts.orderBy || undefined);

  return {
    orderBy,
    where,
    include: findArgs?.include || null,
    skip: paginationOpts.offset || undefined,
    take: paginationOpts.limit || undefined,
  };
};

export const paginate = async <GenericModelType>({
  findManyArgs,
  paginationOpts = {},
  countArgs,
  useSlice = true
} : PaginateProps,
) => {
  const { offset, limit, pageIndex } = paginationOpts;
  const { countCallBack, countWhereInput, ...countRest } = countArgs;
  const { findArgs, findManyCallBack, orderFields, searchFields, ...rest } = findManyArgs;
  console.log('pagination opts: ', paginationOpts)
  // Find entries logic
  const findManyInput = constructFindManyInput({ ...findManyArgs, paginationOpts });
  const entries = await findManyArgs.findManyCallBack({ props: findManyInput, paginationOpts, rest });
  console.log('entries: ', entries)
  const slicedEntries = slice(entries, (offset || 0), (limit || entries.length), (pageIndex || 0));
  console.log('sliced entries: ', slicedEntries);
  // Page logic
  const triggerTotal = await countCallBack({ props: countWhereInput, paginationOpts, rest: countRest });
  const totalPages = paginationOpts.limit ? Math.ceil(triggerTotal / (paginationOpts.limit)) : 1;
  const currentPage = paginationOpts.pageIndex && paginationOpts.pageIndex <= totalPages
    ? paginationOpts.pageIndex : 1;

  const pageInfo: NexusGenRootTypes['PaginationPageInfo'] = {
    nrPages: totalPages,
    pageIndex: currentPage,
  };

  return {
    entries: useSlice ? slicedEntries : entries as GenericModelType[],
    pageInfo,
  };
};
