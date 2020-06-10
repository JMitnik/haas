import React, { useState } from 'react';

import { Div, Grid, H4, H5, Hr, Span } from '@haas/ui';
import { RowComponentProps } from 'components/Table/RowComponentInterfaces';

const Row = ({ headers, data, index }: RowComponentProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const amtCells = headers.length;
  const percentage = 100 / amtCells;
  const templateColumns = `${percentage.toString()}% `.repeat(amtCells);

  return (
    <Grid gridRowGap={0} gridColumnGap={5} gridTemplateColumns={templateColumns} onClick={() => setIsExpanded(!isExpanded)}>
      { headers && headers.map(({ accessor, Cell }) => {
        const result = Object.entries(data).find((property) => property[0] === accessor);
        if (result) return <Cell value={result[1]} key={`${index}-${result[0]}`} />;
        return null;
      })}
    </Grid>
  );
};

export default Row;
