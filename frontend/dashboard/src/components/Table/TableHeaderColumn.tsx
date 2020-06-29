import { Div, H3, Span } from '@haas/ui';
import React from 'react';

interface TableHeaderColumnProps {
  value: string;
  accessor: string;
  sortProperties: {
    id: string;
    desc: boolean;
  }[];
  onSortChange?: (accessor: string) => void;
  onPaginationChange?: React.Dispatch<React.SetStateAction<TableProps>>;
  disableSorting?: boolean;
}

interface TableProps {
  activeStartDate: Date | null;
  activeEndDate: Date | null;
  activeSearchTerm: string;
  pageIndex: number;
  pageSize: number;
  sortBy: {
    id: string;
    desc: boolean;
  }[]
}

const TableHeaderColumn = (
  { sortProperties, accessor, value, onPaginationChange, onSortChange, disableSorting }: TableHeaderColumnProps,
) => (
  <Div
    onClick={() => onSortChange && onSortChange(accessor)}
    useFlex
    flexDirection="row"
    justifyContent="center"
    alignItems="center"
    borderRadius="10px 0 0 10px"
  >
    <Div display="inline-block" padding="10px">
      <H3 color="#6d767d">
        {value}
      </H3>
    </Div>
    <Span>
      {(sortProperties[0].id === accessor && !disableSorting) ? (sortProperties[0].desc ? '🔽' : '🔼') : ''}
    </Span>
  </Div>
);

export default TableHeaderColumn;
