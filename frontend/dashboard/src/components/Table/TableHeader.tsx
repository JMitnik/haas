
import { PlusCircle } from 'react-feather';
import React from 'react';
import styled from 'styled-components/macro';

import { Div, Grid } from '@haas/ui';

import { ErrorBoundary } from 'react-error-boundary';
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

const AddNewUser = styled(Div)`
  position: absolute;
  cursor: pointer;
  top: 17.5px;
  right: 15px;
  color: #6d767d;

  :hover {
    color: #000;
  }
`;

const TableHeader = ({ sortProperties, headers, onPaginationChange, onAddEntry, disableSorting }: TableHeaderProps) => {
  const nrHeaders = headers.length;
  const templateColumns = '1fr '.repeat(nrHeaders);

  return (
    <Grid
      position="relative"
      backgroundColor="#f1f5f8"
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

      {onAddEntry && (
        <AddNewUser onClick={onAddEntry}>
          <PlusCircle />
        </AddNewUser>
      )}

    </Grid>
  );
};

export default TableHeader;
