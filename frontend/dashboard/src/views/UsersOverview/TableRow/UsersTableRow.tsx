import { Edit, X } from 'react-feather';
import React, { useState } from 'react';

import { DeleteButtonContainer, EditButtonContainer, Grid } from '@haas/ui';
import { UserRowProps } from 'components/Table/TableTypes';

const UsersTableRow = ({ headers, data, index, onDeleteEntry, onEditEntry }: UserRowProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const amtCells = headers.length;
  const percentage = 100 / amtCells;
  const templateColumns = `${percentage.toString()}% `.repeat(amtCells);
  const userId = data.id;

  return (
    <Grid
      style={{ position: 'relative' }}
      gridRowGap={0}
      gridColumnGap={5}
      gridTemplateColumns={templateColumns}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      {headers && headers.map(({ accessor, Cell }) => {
        const result = Object.entries(data).find((property) => property[0] === accessor);
        if (result) return <Cell value={result[1]} key={`${index}-${result[0]}`} />;
        return null;
      })}
      <EditButtonContainer
        style={{ top: '0px' }}
        onClick={(event) => onEditEntry && onEditEntry(event, userId)}
      >
        <Edit />
      </EditButtonContainer>
      <DeleteButtonContainer
        style={{ top: '0px' }}
        onClick={(event) => onDeleteEntry && onDeleteEntry(event, userId)}
      >
        <X />
      </DeleteButtonContainer>
    </Grid>
  );
};

export default UsersTableRow;
