import React from 'react';

import { DataGridProps, TableProps } from 'types/generic';
import { Grid } from '@haas/ui';
import { TableRowProps } from 'components/Table/TableTypes';
import PaginationControls from 'components/Table/TablePaginationControls';
import TableHeader from 'components/Table/TableHeader';
import TableRow from 'components/Table/TableRow';

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
}

const Table = ({
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
    <Grid gridRowGap={2}>
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

      {!hidePagination && (
        <PaginationControls paginationProps={paginationProps} onPageChange={handlePage} />
      )}
    </Grid>
  );
};

export default Table;
