import React, { useState } from 'react';
import styled from 'styled-components/macro';

import { Div } from '@haas/ui';
import { Grid } from '@chakra-ui/core';
import { TableRowProps } from 'components/Table/TableTypes';

import { ExpandedRowContainer, RowContainer } from './TableStyles';

const TableOptionsContainer = styled(Div)`
  position: absolute;
  top: 50%;
  z-index: 300;
  transform: translateY(-50%);
  right: 0;
  width: 3em;
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
              <Cell value={result[1]} key={`${index}-${result[0]}`} {...data} />
            );
          }

          return null;
        })}
      </Grid>

      <Div>
        {!!renderOptions && (
        <TableOptionsContainer>
          <>{renderOptions(data)}</>
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
