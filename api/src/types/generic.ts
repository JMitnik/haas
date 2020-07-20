export type OrderByType = 'score' | 'id' | 'createdAt';

export interface OrderByProps {
  by: OrderByType;
  desc?: boolean | null;
}

export interface PaginationProps {
  pageIndex?: Nullable<number>,
  offset?: Nullable<number>,
  limit?: Nullable<number>,
  orderBy?: Nullable<Array<OrderByProps>>,
  startDate?: Nullable<Date>,
  endDate?: Nullable<Date>,
  searchTerm?: Nullable<string>
}

export type Nullable<T> = T | null | undefined;

export function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
  return value !== null && value !== undefined;
}
