import React from 'react';

import { DataGridProps, TableProps } from 'types/generic';
import { Grid } from '@haas/ui';
import HeaderComponent from 'components/Table/HeaderComponent';
import PaginationSpinner from 'components/Table/PaginationSpinner';
import Row from 'components/Table/Row';

import { RowComponentProps } from 'components/Table/RowComponentInterfaces';

interface TableInputProps {
  headers: {
    Header: string;
    accessor: string;
    Cell: ({ value }: { value: any }) => JSX.Element;
  }[]
  data: Array<any>;
  CustomRow?: (props: RowComponentProps) => JSX.Element;
  permissions?: Array<any>;
  onPaginationChange: React.Dispatch<React.SetStateAction<TableProps>>;
  onDeleteEntry?: (event: any, userId: string) => Promise<void>;
  onEditEntry?: (event: any, userId: string) => void;
  onAddEntry?: (event: any) => void;
  paginationProps: DataGridProps;
}

const Table = (
  { headers, data, paginationProps, onPaginationChange, onAddEntry, CustomRow, onEditEntry, onDeleteEntry, permissions }: TableInputProps,
) => {
  const handlePage = (newPageIndex: number) => {
    onPaginationChange((prevValues) => ({ ...prevValues, pageIndex: newPageIndex }));
  };

  return (
    <Grid gridRowGap={2}>
      <HeaderComponent
        sortProperties={paginationProps.sortBy}
        onPaginationChange={onPaginationChange}
        headers={headers}
        onAddEntry={onAddEntry}
      />
      {data && data.map(
        (dataEntry, index) => (CustomRow
          ? <CustomRow headers={headers} onEditEntry={onEditEntry} onDeleteEntry={onDeleteEntry} permissions={permissions} data={dataEntry} key={index} index={index} />
          : <Row headers={headers} onEditEntry={onEditEntry} onDeleteEntry={onDeleteEntry} data={dataEntry} key={index} index={index} />),
      )}
      <PaginationSpinner paginationProps={paginationProps} onPageChange={handlePage} />
    </Grid>
  );
};

export default Table;
