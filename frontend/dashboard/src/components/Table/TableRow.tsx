import React, { useState } from 'react';

import { Grid } from '@haas/ui';
import { TableRowProps } from 'components/Table/TableTypes';

const TableRow = ({ headers, data, index }: TableRowProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const nrCells = headers.length;
  const templateColumns = '1fr '.repeat(nrCells);

  return (
    <Grid
      gridRowGap={0}
      gridColumnGap={5}
      gridTemplateColumns={templateColumns}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      {headers && headers.map(({ accessor, Cell }) => {
        const result = Object.entries(data).find((property) => property[0] === accessor);

        if (result) {
          return (
            <Cell value={result[1]} key={`${index}-${result[0]}`} />
          );
        }

        return null;
      })}

    </Grid>
  );
};

export default TableRow;
