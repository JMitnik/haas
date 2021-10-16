import * as UI from '@haas/ui';
import React from 'react';
import styled from 'styled-components';

import * as Popover from 'components/Common/Popover';

const TableCellButtonContainer = styled(UI.Div)`
  transition: all ease-in 0.2s;
  text-align: left;

  &:hover {
    transition: all ease-in 0.2s;
    box-shadow: 0 4px 6px rgba(50,50,93,.07), 0 1px 3px rgba(0,0,0,.03);
  }
`;

export const InnerCell = ({
  children,
  renderBody,
  header,
}: { children: React.ReactNode, header?: string, renderBody?: () => React.ReactNode }) => (
  <UI.Div onClick={(e) => e.stopPropagation()}>
    <Popover.Base>
      <Popover.Trigger>
        <TableCellButtonContainer
          as="button"
          py={1}
          px={2}
          borderRadius={10}
          border="1px solid"
          borderColor="gray.100"
        >
          {children}
        </TableCellButtonContainer>
      </Popover.Trigger>
      {!!renderBody && (
        <Popover.Body hasArrow header={header}>
          {renderBody?.()}
        </Popover.Body>
      )}
    </Popover.Base>
  </UI.Div>
);
