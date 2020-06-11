import React from 'react';

import { DataGridProps, TableProps } from 'types/generic';
import { Grid } from '@haas/ui';
import HeaderComponent from 'components/Table/HeaderComponent';
import PaginationSpinner from 'components/Table/PaginationSpinner';

import RowComponent from './RowComponent/RowComponent';

interface TableInputProps {
  headers: {
    Header: string;
    accessor: string;
    Cell: ({ value }: { value: any }) => JSX.Element;
  }[]
  data: Array<any>;
  permissions: Array<any>;
  onPaginationChange: React.Dispatch<React.SetStateAction<TableProps>>;
  gridProperties: DataGridProps;
}

const RolesTable = (
  { headers, data, gridProperties, onPaginationChange, permissions }: TableInputProps,
) => {
  const handlePage = (newPageIndex: number) => {
    onPaginationChange((prevValues) => ({ ...prevValues, pageIndex: newPageIndex }));
  };

  return (
    <Grid gridRowGap={2}>
      <HeaderComponent
        sortProperties={gridProperties.sortBy}
        onPaginationChange={onPaginationChange}
        headers={headers}
      />
      {data && data.map(
        (dataEntry, index) => <RowComponent headers={headers} data={dataEntry} permissions={permissions} key={index} index={index} />,
      )}
      <PaginationSpinner gridProperties={gridProperties} handlePage={handlePage} />
    </Grid>
  );
};

export default RolesTable;
