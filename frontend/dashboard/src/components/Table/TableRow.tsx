import React, { useState } from 'react';

import { TableRowProps } from 'components/Table/TableTypes';

import { RowContainer } from './TableStyles';

const TableRow = ({ headers, data, index, renderExpandedRow }: TableRowProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const nrCells = headers.length;
  const templateColumns = '1fr '.repeat(nrCells);

  return (
    <RowContainer
      gridTemplateColumns={templateColumns}
      onClick={() => setIsExpanded(!isExpanded)}
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

      {isExpanded && renderExpandedRow}
    </RowContainer>
  );
};

export default TableRow;
