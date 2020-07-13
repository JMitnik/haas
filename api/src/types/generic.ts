export type OrderByType = 'score' | 'id' | 'createdAt';

export interface OrderByProps {
  id: OrderByType;
  desc: boolean;
}

export interface PaginationProps {
  pageIndex?: number,
  offset?: number,
  limit?: number,
  orderBy?: Array<OrderByProps>,
  startDate?: Date,
  endDate?: Date,
  searchTerm?: string
}
