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
  onGridPropertiesChange: React.Dispatch<React.SetStateAction<TableProps>>;
  onDeleteUser: (event: any, userId: string) => Promise<void>;
  gridProperties: DataGridProps;
}

const UserTable = (
  { headers, data, gridProperties, onGridPropertiesChange, onDeleteUser }: TableInputProps,
) => {
  const handlePage = (newPageIndex: number) => {
    onGridPropertiesChange((prevValues) => ({ ...prevValues, pageIndex: newPageIndex }));
  };

  return (
    <Grid gridRowGap={2}>
      <HeaderComponent
        sortProperties={gridProperties.sortBy}
        onGridPropertiesChange={onGridPropertiesChange}
        headers={headers}
      />
      {data && data.map(
        (dataEntry, index) => <Row headers={headers} onDeleteUser={onDeleteUser} data={dataEntry} key={index} index={index} />,
      )}
      <PaginationSpinner gridProperties={gridProperties} handlePage={handlePage} />
    </Grid>
  );
};

export default UserTable;
