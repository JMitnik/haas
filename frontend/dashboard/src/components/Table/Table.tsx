import React from 'react';

import { DataGridProps, TableProps } from 'types/generic';
import { Div, Flex, Grid, H4 } from '@haas/ui';
import { Info } from 'react-feather';
import PaginationControls from 'components/Table/TablePaginationControls';
import TableHeader from 'components/Table/TableHeader';
import TableRow from 'components/Table/TableRow';
import styled, { css } from 'styled-components';

const TableGrid = styled(Grid)`
  ${({ theme }) => css`
      border-radius: ${theme.borderRadiuses.lg};
      grid-template-rows: repeat(9, minmax(50px, auto));
      grid-row-gap: 2;
  `}
`;

interface TableInputProps {
  headers: {
    Header: string;
    accessor: string;
    Cell: ({ value }: { value: any }) => JSX.Element;
  }[]
  data: Array<any>;
  CustomRow?: any;
  permissions?: Array<any>;
  onPaginationChange: React.Dispatch<React.SetStateAction<TableProps>>;
  onDeleteEntry?: (event: any, userId: string) => void;
  onEditEntry?: (event: any, userId: string) => void;
  onAddEntry?: (event: any) => void;
  paginationProps: DataGridProps;
  hidePagination?: boolean;
  disableSorting?: boolean;
  loading?: boolean;
}

const Table = ({
  loading,
  headers,
  data,
  paginationProps,
  onPaginationChange,
  onAddEntry,
  CustomRow,
  onEditEntry,
  onDeleteEntry,
  permissions,
  hidePagination,
  disableSorting,
}: TableInputProps) => {
  const handlePage = (newPageIndex: number) => {
    if (onPaginationChange) {
      onPaginationChange((prevValues) => ({ ...prevValues, pageIndex: newPageIndex }));
    }
  };

  return (
    <TableGrid>
      <TableHeader
        sortProperties={paginationProps.sortBy}
        onPaginationChange={onPaginationChange}
        headers={headers}
        onAddEntry={onAddEntry}
        disableSorting={disableSorting}
      />

      {data && data.map((dataEntry, index) => (
        CustomRow ? (
          <CustomRow
            headers={headers}
            onEditEntry={onEditEntry}
            onDeleteEntry={onDeleteEntry}
            permissions={permissions}
            data={dataEntry}
            key={index}
            index={index}
          />
        ) : (
          <TableRow
            headers={headers}
            onEditEntry={onEditEntry}
            onDeleteEntry={onDeleteEntry}
            data={dataEntry}
            key={index}
            index={index}
          />
        )
      ))}

      {data.length === 0 && !loading && (
        <Flex gridRow="2 / -1" gridColumn="1 / -1" justifyContent="center" alignItems="center">
          <Div color="default.darker" marginRight="5px">
            <Info />
          </Div>
          <H4 color="default.darker">No data available</H4>
        </Flex>
      )}

      { data.length === 0 && loading && (
      <Flex gridRow="2 / -1" gridColumn="1 / -1" justifyContent="center" alignItems="center">
        <Div color="default.darker" marginRight="5px">
          <Info />
        </Div>
        <H4 color="default.darker">Loading data...</H4>
      </Flex>
      )}

      {!hidePagination && (
        <PaginationControls paginationProps={paginationProps} onPageChange={handlePage} />
      )}
    </TableGrid>
  );
};

export default Table;
