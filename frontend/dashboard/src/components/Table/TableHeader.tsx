import React from 'react';

import { Grid } from '@haas/ui';

import { TableHeaderProps } from './TableTypes';
import TableHeaderColumn from './TableHeaderColumn';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const TableHeader = ({ sortProperties, headers, onPaginationChange, onAddEntry, disableSorting }: TableHeaderProps) => {
  const nrHeaders = headers.length;
  const templateColumns = '1fr '.repeat(nrHeaders);

  return (
    <Grid
      borderRadius="10px 10px 0 0"
      py={2}
      gridGap={0}
      px={4}
      position="relative"
      backgroundColor="gray.100"
      gridTemplateColumns={templateColumns}
    >
      {headers && headers.map((header, index) => (
        <TableHeaderColumn
          disableSorting={header?.disableSorting}
          sortProperties={sortProperties}
          onPaginationChange={onPaginationChange}
          accessor={header.accessor}
          Header={header?.Header || ''}
          key={index}
        />
      ))}
    </Grid>
  );
};

export default TableHeader;
