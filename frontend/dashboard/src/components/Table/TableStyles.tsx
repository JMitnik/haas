import { Div } from '@haas/ui';
import styled, { css } from 'styled-components';

export const RowContainer = styled(Div)<{isExpanded?: boolean}>`
  ${({ theme, isExpanded }) => css`
    display: grid;
    cursor: pointer;
    padding-left: ${theme.gutter}px;
    padding-right: ${theme.gutter}px;
    padding-top: ${theme.gutter / 3}px;
    padding-bottom: ${theme.gutter / 3}px;
    border-top: ${isExpanded ? '1px solid rgba(0,0,0,.05)' : '1px solid transparent'};
    box-shadow: ${isExpanded ? '0 4px 6px -1px rgba(0,0,0,.05),0 2px 4px -1px rgba(0,0,0,.06)!important' : 'none'};
  
    &:hover {
      transition: all .2s cubic-bezier(.55,0,.1,1);
      border-top:  ${isExpanded && '1px solid rgba(0,0,0,.05)'};
      box-shadow: ${isExpanded && '0 4px 6px -1px rgba(0,0,0,.1),0 2px 4px -1px rgba(0,0,0,.06) !important'};
    }
  `}
`;

export const TableContainer = styled(Div)`
  ${({ theme }) => css`
    background: white;
    border-radius: ${theme.borderRadiuses.lg};
    grid-template-rows: repeat(9, minmax(50px, auto));
    grid-row-gap: 4px;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);

    ${RowContainer}:nth-child(even) {
      background: ${theme.colors.gray[50]};
    }
  `}
`;
