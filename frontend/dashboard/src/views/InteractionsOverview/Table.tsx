import React from 'react';

import { DataGridProps, TableProps } from 'types/generic';
import { Grid } from '@haas/ui';
import HeaderComponent from 'components/Table/TableHeader';
import TablePaginationControls from 'components/Table/TablePaginationControls';

import TableRow from './TableRow/TableRow';

interface TableInputProps {
  headers: {
    Header: string;
    accessor: string;
    Cell: ({ value }: { value: any }) => JSX.Element;
  }[]
  data: Array<any>;
  onPaginationChange: React.Dispatch<React.SetStateAction<TableProps>>;
  gridProperties: DataGridProps;
}

const InteractionTable = ({
  headers,
  data,
  gridProperties,
  onPaginationChange,
}: TableInputProps) => {
  const handlePageChange = (newPageIndex: number) => {
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
        (dataEntry, index) => <TableRow headers={headers} data={dataEntry} key={index} index={index} />,
      )}

      <TablePaginationControls paginationProps={gridProperties} onPageChange={handlePageChange} />
    </Grid>
  );
};

export default InteractionTable;
