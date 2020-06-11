import { Edit, X } from 'react-feather';
import { useHistory, useParams } from 'react-router';
import React, { useState } from 'react';

import { DeleteButtonContainer, Div, EditButtonContainer, Grid, H4, H5, Hr, Span } from '@haas/ui';
import { UserRowProps } from 'components/Table/RowComponentInterfaces';

const UserRow = ({ headers, data, index, onDeleteEntry, onEditEntry }: UserRowProps) => {
  const history = useHistory();
  const { customerId } = useParams<{ customerId: string }>();
  const [isExpanded, setIsExpanded] = useState(false);
  const amtCells = headers.length;
  const percentage = 100 / amtCells;
  const templateColumns = `${percentage.toString()}% `.repeat(amtCells);
  const userId = data.id;

  const setEditUser = (event: any, userId: string) => {
    history.push(`/dashboard/c/${customerId}/u/${userId}/edit`);
    event.stopPropagation();
  };

  return (
    <Grid style={{ position: 'relative' }} gridRowGap={0} gridColumnGap={5} gridTemplateColumns={templateColumns} onClick={() => setIsExpanded(!isExpanded)}>
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

export default UserRow;
