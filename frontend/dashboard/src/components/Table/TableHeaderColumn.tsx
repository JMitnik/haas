import React from 'react';

import { Div, H3, Span } from '@haas/ui';

interface TableHeaderColumnProps {
  value: string;
  accessor: string;
  sortProperties: {
    id: string;
    desc: boolean;
  }[];
  onPaginationChange: React.Dispatch<React.SetStateAction<TableProps>>;
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

const TableHeaderColumn = ({
  sortProperties,
  accessor,
  value,
  onPaginationChange,
}: TableHeaderColumnProps) => {
  const handleSort = () => {
    onPaginationChange((prevValues) => {
      const { sortBy } = prevValues;
      const newOrderBy = sortBy?.[0]?.id === accessor
        ? [{ id: sortBy?.[0]?.id, desc: !sortBy?.[0]?.desc }]
        : [{ id: accessor, desc: true }];

      return { ...prevValues, sortBy: newOrderBy };
    });
  };

  return (
    <Div
      onClick={handleSort}
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
        {(sortProperties[0].id === accessor) ? (sortProperties[0].desc ? '🔽' : '🔼') : ''}
      </Span>
    </Div>
  );
};

export default TableHeaderColumn;
