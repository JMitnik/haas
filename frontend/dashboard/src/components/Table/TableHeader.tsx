import React from 'react';

import { Grid } from '@haas/ui';

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
    by: string;
    desc: boolean;
  }[]
}

interface TableHeaderProps {
  headers: Array<TableHeaderColumnProps>;
  sortProperties: {
    by: string;
    desc: boolean;
  }[];
  onAddEntry?: (event: any) => void;
  onPaginationChange: React.Dispatch<React.SetStateAction<TableProps>>;
  disableSorting?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const TableHeader = ({ sortProperties, headers, onPaginationChange, onAddEntry, disableSorting }: TableHeaderProps) => {
  const nrHeaders = headers.length;
  const templateColumns = '1fr '.repeat(nrHeaders);

  return (
    <Grid
      borderRadius="lg"
      paddingLeft="15px"
      paddingRight="15px"
      position="relative"
      backgroundColor="white"
      color="black"
      gridColumnGap={5}
      gridTemplateColumns={templateColumns}
    >

      {headers && headers.map((header, index) => (
        <TableHeaderColumn
          disableSorting={disableSorting}
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
