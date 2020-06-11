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
  addButton?: boolean;
  CustomRow?: (props: RowComponentProps) => JSX.Element;
  onPaginationChange: React.Dispatch<React.SetStateAction<TableProps>>;
  gridProperties: DataGridProps;
}

const Table = (
  { headers, data, gridProperties, onPaginationChange, addButton, CustomRow }: TableInputProps,
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
        addButton={addButton}
      />
      {data && data.map(
        (dataEntry, index) => (CustomRow
          ? <CustomRow headers={headers} data={dataEntry} key={index} index={index} />
          : <Row headers={headers} data={dataEntry} key={index} index={index} />),
      )}
      <PaginationSpinner gridProperties={gridProperties} handlePage={handlePage} />
    </Grid>
  );
};

export default Table;
