import * as UI from '@haas/ui';
import React from 'react';
import styled, { css } from 'styled-components';

import { ReactComponent as IconSortDown } from 'assets/icons/icon-cheveron-down.svg';
import { ReactComponent as IconSortUp } from 'assets/icons/icon-cheveron-up.svg';

interface TableHeadingCellProps {
  children: React.ReactNode;
  sorting?: boolean;
  descending?: boolean;
  onDescendChange?: (isDescend: boolean) => void;
}

const TableHeadingCellContainer = styled(UI.Div)`
  ${({ theme }) => css`
    font-weight: 600;
    line-height: 1rem;
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: ${theme.colors.gray[500]};
    display: flex;
    align-items: center;

    svg {
      stroke: ${theme.colors.gray[400]};
    }

    .active {
      stroke: ${theme.colors.gray[800]};
    }
  `}
`;

export const HeadingCell = ({ children, sorting, descending = true, onDescendChange }: TableHeadingCellProps) => (
  <TableHeadingCellContainer>
    {children}

    {!!onDescendChange && (
      <UI.Icon ml={2} width="21px" display="block">
        <IconSortUp
          onClick={() => onDescendChange?.(false)}
          className={sorting && !descending ? 'active' : ''}
          style={{ cursor: 'pointer' }}
        />
        <IconSortDown
          onClick={() => onDescendChange?.(true)}
          className={sorting && descending ? 'active' : ''}
          style={{ marginTop: '-8px', cursor: 'pointer' }}
        />
      </UI.Icon>
    )}
  </TableHeadingCellContainer>
);
