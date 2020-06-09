export interface PaginationProps {
  pageIndex: number,
  offset: number,
  limit: number,
  orderBy: { id: string, desc: boolean},
  startDate: Date,
  endDate: Date,
  searchTerm: string
}
