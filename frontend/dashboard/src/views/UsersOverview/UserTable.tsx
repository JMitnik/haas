import { ApolloError } from 'apollo-boost';
import { useMutation } from '@apollo/react-hooks';
import React from 'react';

import { DataGridProps, TableProps } from 'types/generic';
import { Grid } from '@haas/ui';
import HeaderComponent from 'components/Table/HeaderComponent';
import PaginationSpinner from 'components/Table/PaginationSpinner';

import { getCustomerQuery } from '../../queries/getCustomersQuery';
import Row from './Row';
import deleteUserQuery from '../../mutations/deleteUser';

interface TableInputProps {
  headers: {
    Header: string;
    accessor: string;
    Cell: ({ value }: { value: any }) => JSX.Element;
  }[]
  data: Array<any>;
  onPaginationChange: React.Dispatch<React.SetStateAction<TableProps>>;
  onDeleteEntry?: (event: any, userId: string) => Promise<void>;
  onEditEntry?: (event: any, userId: string) => void;
  onAddEntry?: (event: any) => void;
  gridProperties: DataGridProps;
}

const UserTable = (
  { headers, data, gridProperties, onPaginationChange, onDeleteEntry, onEditEntry, onAddEntry }: TableInputProps,
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
        onAddEntry={onAddEntry}
      />
      {data && data.map(
        (dataEntry, index) => <Row headers={headers} onEditEntry={onEditEntry} onDeleteEntry={onDeleteEntry} data={dataEntry} key={index} index={index} />,
      )}
      <PaginationSpinner gridProperties={gridProperties} handlePage={handlePage} />
    </Grid>
  );
};

export default UserTable;
