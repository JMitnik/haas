import React from 'react';

import { Flex } from '@haas/ui';

interface PaginationProps {
  pageIndex: number;
  pageSize: number;
  pageCount: number;
  orderBy: Array<any>;
}

interface TablePaginationControlsProps {
  paginationProps: PaginationProps;
  onPageChange: (newPageIndex: number) => void;
}

const TablePaginationControls = ({ paginationProps, onPageChange }: TablePaginationControlsProps) => (
  <Flex alignItems="center" justifyContent="center">
    {/* TODO: Make these buttons styled, use flex-properties instead of margin */}
    <button
      type="button"
      style={{ padding: '5px', margin: '5px' }}
      onClick={() => onPageChange(0)}
      disabled={paginationProps.pageIndex === 0}
    >
      {'<<'}
    </button>
    <button
      type="button"
      style={{ padding: '5px 7.5px', margin: '5px' }}
      onClick={() => onPageChange(paginationProps.pageIndex - 1)}
      disabled={paginationProps.pageIndex === 0}
    >
      {'<'}
    </button>
    <button
      type="button"
      style={{ padding: '5px 7.5px', margin: '5px' }}
      onClick={() => onPageChange(paginationProps.pageIndex + 1)}
      disabled={paginationProps.pageIndex === paginationProps.pageCount - 1}
    >
      {'>'}
    </button>
    <button
      type="button"
      style={{ padding: '5px', margin: '5px' }}
      onClick={() => onPageChange(paginationProps.pageCount - 1)}
      disabled={paginationProps.pageIndex === paginationProps.pageCount - 1}
    >
      {'>>'}
    </button>
    <span>
      Page
      {' '}
      <strong>
        {paginationProps.pageIndex + 1}
        {' '}
        of
        {' '}
        {paginationProps.pageCount}
      </strong>
    </span>
  </Flex>
);

export default TablePaginationControls;
