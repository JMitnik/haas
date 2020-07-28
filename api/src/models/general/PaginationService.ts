class PaginationService {
  static formatDate(date: string): Date {
    return new Date(date);
  }

  static getItemsByIndex = (
    items: Array<any>,
    offset: number,
    limit?: number,
    pageIndex?: number,
  ) => (limit && (offset + limit) < items.length
    ? items.slice(offset, ((pageIndex || 0) + 1) * limit)
    : items.slice(offset, items.length));
}

export default PaginationService;

