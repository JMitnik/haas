/**
 * Calculates offset-based pagination output.
 * @param totalItems
 * @param offset
 * @param perPage
 * @returns
 */
export const offsetPaginate = (totalItems: number, offset: number, perPage: number) => {
  const hasNextPage = !(perPage + offset > totalItems);
  const hasPrevPage = !(offset == 0);
  const totalPages = perPage ? Math.ceil(totalItems / perPage): 0;
  const pageIndex = perPage ? Math.ceil(offset / perPage) : 0;
  const prevPageOffset = Math.max(0, offset - perPage);
  const nextPageOffset = Math.max(0, Math.min(offset + perPage, totalItems - perPage));

  return {
    hasNextPage,
    hasPrevPage,
    totalPages,
    pageIndex,
    prevPageOffset,
    nextPageOffset
  }
}
