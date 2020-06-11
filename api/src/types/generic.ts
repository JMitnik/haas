export interface PaginationProps {
  pageIndex: number,
  offset: number,
  limit: number,
  orderBy: Array<{ id: string, desc: boolean}>,
  startDate: Date,
  endDate: Date,
  searchTerm: string
}
