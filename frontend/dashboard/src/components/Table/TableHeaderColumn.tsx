import { Div, H3, Span } from '@haas/ui';
import React from 'react';

interface TableHeaderColumnProps {
  value: string;
  accessor: string;
  sortProperties: {
    by: string;
    desc: boolean;
  }[];
  onPaginationChange: React.Dispatch<React.SetStateAction<TableProps>>;
  disableSorting?: boolean;
}

interface TableProps {
  activeStartDate: Date | null;
  activeEndDate: Date | null;
  activeSearchTerm: string;
  pageIndex: number;
  pageSize: number;
  sortBy: {
    by: string;
    desc: boolean;
  }[]
}

const TableHeaderColumn = ({
  sortProperties,
  accessor,
  value,
  onPaginationChange,
  disableSorting,
}: TableHeaderColumnProps) => {
  const handleSort = () => {
    if (!disableSorting) {
      onPaginationChange((prevValues) => {
        const { sortBy } = prevValues;
        const newOrderBy = sortBy?.[0]?.by === accessor
          ? [{ by: sortBy?.[0]?.by, desc: !sortBy?.[0]?.desc }]
          : [{ by: accessor, desc: true }];
        return { ...prevValues, sortBy: newOrderBy, pageIndex: 0 };
      });
    }
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
        {(sortProperties[0].by === accessor && !disableSorting) ? (sortProperties[0].desc ? '🔽' : '🔼') : ''}
      </Span>
    </Div>
  );
};

export default TableHeaderColumn;
