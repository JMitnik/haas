import { Edit, X } from 'react-feather';
import { ErrorBoundary } from 'react-error-boundary';
import React, { useState } from 'react';

import { Button, Popover, PopoverArrow,
  PopoverBody, PopoverCloseButton, PopoverContent, PopoverFooter, PopoverHeader, PopoverTrigger } from '@chakra-ui/core';
import { DeleteButtonContainer, Div, EditButtonContainer, Grid, Span } from '@haas/ui';
import { UserRowProps } from 'components/Table/TableTypes';

const UsersTableRow = ({ headers, data, index, onDeleteEntry, onEditEntry }: UserRowProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const amtCells = headers.length;
  const percentage = 100 / amtCells;
  const templateColumns = `${percentage.toString()}% `.repeat(amtCells);
  const userId = data.id;

  return (
    <ErrorBoundary FallbackComponent={() => (<Div>Users table row not renderable</Div>)}>
      <Grid
        paddingLeft="15px"
        paddingRight="15px"
        position="relative"
        gridRowGap={0}
        gridColumnGap={5}
        gridTemplateColumns={templateColumns}
        onClick={() => setIsExpanded(!isExpanded)}
      >

        {/* TODO: Refactor */}
        {headers && headers.map(({ accessor, Cell }) => {
          const result = Object.entries(data).find((property) => property[0] === accessor);

          if (result && result[1]) {
            return <Cell value={result[1]} key={`${index}-${result[0]}`} />;
          }

          return null;
        })}

        <EditButtonContainer
          style={{ top: '0px' }}
          onClick={(event) => onEditEntry && onEditEntry(event, userId)}
        >
          <Edit />
        </EditButtonContainer>
        <Span onClick={(e) => e.stopPropagation()}>
          <Popover
            usePortal
          >
            {({ onClose }) => (
              <>
                <PopoverTrigger>
                  <DeleteButtonContainer
                    style={{ top: '0px' }}
                  >
                    <X />
                  </DeleteButtonContainer>
                </PopoverTrigger>
                <PopoverContent zIndex={4}>
                  <PopoverArrow />
                  <PopoverHeader>Delete</PopoverHeader>
                  <PopoverCloseButton />
                  <PopoverBody>
                    <p>You are about to delete a User. THIS ACTION IS IRREVERSIBLE! Are you sure?</p>
                  </PopoverBody>
                  <PopoverFooter>
                    <Button
                      variantColor="red"
                      onClick={(event) => onDeleteEntry && onDeleteEntry(event, userId, onClose)}
                    >
                      Delete
                    </Button>
                  </PopoverFooter>
                </PopoverContent>
              </>
            )}
          </Popover>
        </Span>

      </Grid>
    </ErrorBoundary>
  );
};

export default UsersTableRow;
