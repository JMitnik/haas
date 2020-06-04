import React from 'react';

import { DataGridProps, TableProps } from 'types/generic';
import { Grid } from '@haas/ui';
import HeaderComponent from 'components/Table/HeaderComponent';
import PaginationSpinner from 'components/Table/PaginationSpinner';

import UserRow from './UserRow';

interface TableInputProps {
    headers: {
        Header: string;
        accessor: string;
        Cell: ({ value }: { value: any }) => JSX.Element;
    }[]
    data: Array<any>;
    onGridPropertiesChange: React.Dispatch<React.SetStateAction<TableProps>>;
    gridProperties: DataGridProps;
}

const UsersTable = (
    { headers, data, gridProperties, onGridPropertiesChange }: TableInputProps,
) => {
    const handlePage = (newPageIndex: number) => {
        onGridPropertiesChange((prevValues) => ({ ...prevValues, pageIndex: newPageIndex }))
    }

    return (
      <Grid gridRowGap={2}>
        <HeaderComponent
          sortProperties={gridProperties.sortBy}
          onGridPropertiesChange={onGridPropertiesChange}
          headers={headers}
        />
        {data && data.map(
            (dataEntry, index) => <UserRow headers={headers} data={dataEntry} key={index} index={index} />,
        )}
        <PaginationSpinner gridProperties={gridProperties} handlePage={handlePage} />
      </Grid>
    )
}

export default UsersTable;
