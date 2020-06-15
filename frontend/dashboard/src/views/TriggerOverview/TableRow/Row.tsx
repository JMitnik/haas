import { Edit, X } from 'react-feather';
import React, { useState } from 'react';

import { DeleteButtonContainer, Div, EditButtonContainer, Grid, H4, H5, Hr } from '@haas/ui';
import { UserRowProps } from 'components/Table/RowComponentInterfaces';

const UserRow = ({ headers, data, index, onDeleteEntry, onEditEntry }: UserRowProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const amtCells = headers.length;
  const percentage = 100 / amtCells;
  const templateColumns = `${percentage.toString()}% `.repeat(amtCells);
  const userId = data.id;

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
      { isExpanded && (
        <Div useFlex flexDirection="column" backgroundColor="#f0f0f0" gridColumn="1 / -1">
          <Div padding={25}>
            <Div marginBottom={10} useFlex flexDirection="column">
              <Div useFlex flexDirection="row">
                <Div width="51%">
                  <H4 color="#999999">TRIGGER</H4>
                  <H5 color="#c0bcbb">General information</H5>
                </Div>
              </Div>
              <Div />
            </Div>
            <Hr style={{ marginBottom: '15px' }} color="#999999" />
            <Div useFlex flexDirection="column">
              <Div width="100%" marginBottom="15px">
                <H4 color="#999999">RECIPIENTS</H4>
                <H5 color="#c0bcbb">Select the recipients you want a specific trigger to receive</H5>
              </Div>
            </Div>
          </Div>
        </Div>
      )}
    </Grid>
  );
};

export default UserRow;
