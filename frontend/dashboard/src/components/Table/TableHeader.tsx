import { Grid } from '@haas/ui';
import React from 'react';

import TableHeaderColumn from './TableHeaderColumn';

interface TableHeaderColumnProps {
  Header: string;
  accessor: string;
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

interface TableHeaderProps {
  headers: Array<TableHeaderColumnProps>;
  sortProperties: {
    id: string;
    desc: boolean;
  }[];
  onPaginationChange: React.Dispatch<React.SetStateAction<TableProps>>;
}

const TableHeader = ({ sortProperties, headers, onPaginationChange }: TableHeaderProps) => {
  const nrHeaders = headers.length;
  const percentage = 100 / nrHeaders;
  const templateColumns = `${percentage.toString()}% `.repeat(nrHeaders);

  return (
    <Grid
      backgroundColor="#f1f5f8"
      color="black"
      borderRadius="90px"
      gridColumnGap={5}
      gridTemplateColumns={templateColumns}
    >
      {headers && headers.map((header, index) => (
        <TableHeaderColumn
          sortProperties={sortProperties}
          onPaginationChange={onPaginationChange}
          accessor={header.accessor}
          value={header.Header}
          key={index}
        />
      ))}
    </Grid>
  );
};

export default TableHeader;
