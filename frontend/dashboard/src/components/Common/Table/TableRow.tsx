import * as UI from '@haas/ui';
import styled, { css } from 'styled-components';

interface RowProps {
  isLoading?: boolean;
  isDisabled?: boolean;
}

export const Row = styled(UI.Grid) <RowProps>`
  ${({ isLoading, isDisabled }) => css`
    background: white;
    align-items: center;
    padding: 6px 12px;
    margin-bottom: 12px;
    border-radius: 12px;
    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.01),0 2px 4px -1px rgba(0,0,0,0.03);
    transition: all 0.2s ease-in;
    cursor: pointer;
    transition: all ease-in 0.2s;

    ${isLoading && css`
      transition: all ease-in 0.2s;
      opacity: 0.4;
      pointer-events: none;
    `}

    ${isDisabled && css`
      transition: all ease-in 0.2s;
      opacity: 0.4;
    `}

    &:hover {
      cursor: pointer;
      box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05),0 2px 4px -1px rgba(0,0,0,0.08);
      transition: all 0.2s ease-in;
    }
  `}
`;
