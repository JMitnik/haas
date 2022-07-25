import { NexusGenEnums, NexusGenInputs, NexusGenRootTypes } from '../../../generated/nexus';

export interface FindManyProps {
  findArgs: any;
  searchFields: NexusGenEnums['PaginationSearchEnum'][];
  orderFields: NexusGenEnums['PaginationSortByEnum'][];
}

export interface ConstructFindManyProps extends FindManyProps {
  paginationOpts: NexusGenInputs['PaginationWhereInput'];
}

export interface FindManyCallBackProps {
  props: findManyInput;
  paginationOpts?: NexusGenInputs['PaginationWhereInput'];
  rest?: any;
}

export interface FindManyArgsProps {
  findArgs: any;
  searchFields: NexusGenEnums['PaginationSearchEnum'][];
  orderFields: NexusGenEnums['PaginationSortByEnum'][];
  findManyCallBack: (
    args: FindManyCallBackProps
  ) => Promise<Array<any>>;
  [k: string]: any;
}

export interface CountArgsProps {
  countWhereInput: any;
  countCallBack: (args: FindManyCallBackProps) => Promise<number>;
  [k: string]: any;
}

export interface PaginateProps {
  findManyArgs: FindManyArgsProps;
  countArgs: CountArgsProps;
  paginationOpts?: NexusGenInputs['PaginationWhereInput'];
  useSlice?: boolean;
}

export interface findManyInput {
  where: any;
  take?: number | undefined;
  skip?: number | undefined;
  orderBy?: any;
  include?: any;
}

export const slice = (
  entries: Array<any>,
  offset: number,
  limit: number,
  pageIndex: number,
) => {
  if (entries.length < limit) return entries;

  return (offset + limit) < entries.length
    ? entries.slice(offset, (pageIndex + 1) * limit)
    : entries.slice(offset, entries.length);
};

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

  const sortObject = orderByArray.filter((orderOption) => {
    return orderFields.includes(orderOption?.by);
  }).map(orderOption => ({
    [orderOption?.by]: orderOption.desc ? 'desc' : 'asc',
  }));

  return sortObject;
};

export const constructFindManyInput = (
  findManyArgs: ConstructFindManyProps,
): findManyInput => {
  const { findArgs, orderFields, searchFields, paginationOpts } = findManyArgs;
  const where = findArgs?.where ? constructWhereInput(findArgs?.where, paginationOpts, searchFields) : null;
  const orderBy = constructSortInput(orderFields, paginationOpts.orderBy as any || undefined);

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
  useSlice = true,
}: PaginateProps,
) => {
  const { offset, limit, pageIndex } = paginationOpts;
  const { countCallBack, countWhereInput, ...countRest } = countArgs;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { findArgs, findManyCallBack, orderFields, searchFields, ...rest } = findManyArgs;
  // Find entries logic
  const findManyInput = constructFindManyInput({ ...findManyArgs, paginationOpts });
  const entries = await findManyArgs.findManyCallBack({ props: findManyInput, paginationOpts, rest });
  const slicedEntries = slice(entries, (offset || 0), (limit || entries.length), (pageIndex || 0));
  // Page logic
  const triggerTotal = await countCallBack({ props: countWhereInput, paginationOpts, rest: countRest });
  const totalPages = paginationOpts.limit ? Math.ceil(triggerTotal / (paginationOpts.limit)) : 1;

  const pageInfo: NexusGenRootTypes['DeprecatedPaginationPageInfo'] = {
    nrPages: totalPages || 1,
    pageIndex: (paginationOpts?.pageIndex !== undefined && paginationOpts?.pageIndex !== null)
      ? paginationOpts.pageIndex : 0,
  };

  return {
    entries: useSlice ? slicedEntries : entries as GenericModelType[],
    pageInfo,
  };
};