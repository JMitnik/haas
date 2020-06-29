import React from 'react';

import { DataGridProps, TableProps } from 'types/generic';
import { Grid } from '@haas/ui';
import PaginationSpinner from 'components/Table/TablePaginationControls';
import TableHeader from 'components/Table/TableHeader';
import TableRow from 'components/Table/TableRow';

import { TableRowProps } from 'components/Table/TableTypes';

interface TableInputProps {
  headers: {
    Header: string;
    accessor: string;
    Cell: ({ value }: { value: any }) => JSX.Element;
  }[]
  data: Array<any>;
  CustomRow?: (props: TableRowProps) => JSX.Element;
  permissions?: Array<any>;
  onDeleteEntry?: (event: any, userId: string) => void;
  onEditEntry?: (event: any, userId: string) => void;
  onAddEntry?: (event: any) => void;
  onSortChange?: (accessor: string) => void;
  onPageChange?: (newPageIndex: number) => void;
  paginationProps: DataGridProps;
  hidePagination?: boolean;
  disableSorting?: boolean;
}

const Table = (
  { headers,
    data,
    paginationProps,
    onAddEntry,
    CustomRow,
    onEditEntry,
    onDeleteEntry,
    onSortChange,
    onPageChange,
    permissions,
    hidePagination,
    disableSorting }: TableInputProps,
) => {
  const handlePage = (newPageIndex: number) => {
    if (onPageChange) {
      onPageChange(newPageIndex);
    }
  };

  return (
    <Grid gridRowGap={2}>
      <TableHeader
        sortProperties={paginationProps.orderBy}
        onSortChange={onSortChange}
        headers={headers}
        onAddEntry={onAddEntry}
        disableSorting={disableSorting}
      />
      {data && data.map(
        (dataEntry, index) => (CustomRow
          ? (
            <CustomRow
              headers={headers}
              onEditEntry={onEditEntry}
              onDeleteEntry={onDeleteEntry}
              permissions={permissions}
              data={dataEntry}
              key={index}
              index={index}
            />
          )
          : (
            <TableRow
              headers={headers}
              onEditEntry={onEditEntry}
              onDeleteEntry={onDeleteEntry}
              data={dataEntry}
              key={index}
              index={index}
            />
          )),
      )}
      {!hidePagination && (
        <PaginationSpinner paginationProps={paginationProps} onPageChange={handlePage} />
      )}
    </Grid>
  );
};

export default Table;
