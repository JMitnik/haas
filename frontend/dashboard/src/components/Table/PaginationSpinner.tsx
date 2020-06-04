import React from 'react';

import { Flex } from '@haas/ui';

interface DataGridProps {
    pageIndex: number;
    pageSize: number;
    pageCount: number;
    sortBy: Array<any>;
}

interface PaginationSpinnerProps {
    gridProperties: DataGridProps;
    handlePage: (newPageIndex: number) => void;
}

const PaginationSpinner = ({ gridProperties, handlePage }: PaginationSpinnerProps) => (
  <Flex alignItems="center" justifyContent="center">
    <button
      type="button"
      style={{ padding: '5px', margin: '5px' }}
      onClick={() => handlePage(0)}
      disabled={gridProperties.pageIndex === 0}
    >
      {'<<'}
    </button>
    <button
      type="button"
      style={{ padding: '5px 7.5px', margin: '5px' }}
      onClick={() => handlePage(gridProperties.pageIndex - 1)}
      disabled={gridProperties.pageIndex === 0}
    >
      {'<'}
    </button>
    <button
      type="button"
      style={{ padding: '5px 7.5px', margin: '5px' }}
      onClick={() => handlePage(gridProperties.pageIndex + 1)}
      disabled={gridProperties.pageIndex === gridProperties.pageCount - 1}
    >
      {'>'}
    </button>
    <button
      type="button"
      style={{ padding: '5px', margin: '5px' }}
      onClick={() => handlePage(gridProperties.pageCount - 1)}
      disabled={gridProperties.pageIndex === gridProperties.pageCount - 1}
    >
      {'>>'}
    </button>
    <span>
      Page
      {' '}
      <strong>
        {gridProperties.pageIndex + 1}
        {' '}
        of
        {' '}
        {gridProperties.pageCount}
      </strong>
    </span>
  </Flex>
    );

export default PaginationSpinner;
