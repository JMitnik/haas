import React, { useState } from 'react';
import styled from 'styled-components/macro';

import { ReactComponent as ContextButtonSVG } from 'assets/icons/icon-more.svg';
import { TableRowProps } from 'components/Table/TableTypes';
import ContextButton from 'components/ContextButton';

import { Button, Grid, Menu, MenuButton, MenuList } from '@chakra-ui/core';
import { Div } from '@haas/ui';
import { ExpandedRowContainer, RowContainer } from './TableStyles';

const TableOptionsContainer = styled(Div)`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 0;
  width: 3em;

  button {
    max-width: 100%;
  }
`;

const TableRow = ({ headers, data, index, renderExpandedRow, renderOptions }: TableRowProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const nrCells = headers.length;
  const templateColumns = '1fr '.repeat(nrCells);

  return (
    <RowContainer
      onClick={() => setIsExpanded(!isExpanded)}
      mr={renderOptions ? '1em' : ''}
      enableHover={!!renderExpandedRow}
    >
      <Grid
        gridTemplateColumns={templateColumns}
      >
        {headers && headers.map(({ accessor, Cell }) => {
          const result = Object.entries(data).find((property) => property[0] === accessor);

          if (result && Cell) {
            return (
              <Cell value={result[1]} key={`${index}-${result[0]}`} />
            );
          }

          return null;
        })}
      </Grid>

      <Div>
        {!!renderOptions && (
        <TableOptionsContainer>
          <Menu>
            <MenuButton size="sm" as={Button}>
              <ContextButtonSVG />
            </MenuButton>
            <MenuList>
              <>
                {renderOptions}
              </>
            </MenuList>
          </Menu>
        </TableOptionsContainer>
        )}
      </Div>

      {isExpanded && (
        <ExpandedRowContainer>
          {renderExpandedRow}
        </ExpandedRowContainer>
      )}
    </RowContainer>
  );
};

export default TableRow;
