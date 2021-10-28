import * as UI from '@haas/ui';
import React from 'react';
import styled, { css } from 'styled-components';

import * as Popover from 'components/Common/Popover';

export const TableCellButtonContainer = styled(UI.Div) <{ isDisabled?: boolean }>`
  ${({ isDisabled }) => css`

    transition: all ease-in 0.2s;
    text-align: left;

    ${!isDisabled && css` 
      &:hover {
        transition: all ease-in 0.2s;
        box-shadow: 0 4px 6px rgba(50,50,93,.07), 0 1px 3px rgba(0,0,0,.03);
      }
    `}

    ${isDisabled && css`
      pointer-events: none;
    `}

  `}
`;

interface InnerCellProps {
  brand?: string;
  children: React.ReactNode
  header?: string
  renderBody?: () => React.ReactNode
  isDisabled?: boolean
}

export const InnerCell = ({
  children,
  renderBody,
  header,
  brand,
  isDisabled,
}: InnerCellProps) => (
  <UI.Div display="inline-block" onClick={(e) => e.stopPropagation()}>
    <Popover.Base>
      <Popover.Trigger>
        <TableCellButtonContainer
          isDisabled={isDisabled}
          as="button"
          py={1}
          px={2}
          borderRadius={10}
          border="1px solid"
          borderColor="gray.100"
          bg={brand ? `${brand}.100` : 'none'}
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
