import * as UI from '@haas/ui';
import styled, { css } from 'styled-components';

interface RowProps {
  isLoading?: boolean;
  isDisabled?: boolean;
}

export const Row = styled(UI.Grid) <RowProps>`
  ${({ theme, isLoading, isDisabled }) => css`
    background: white;
    align-items: center;
    padding: 6px 12px;
    margin-bottom: 12px;
    border-radius: 12px;
    box-shadow: ${theme.boxShadows.sm};
    cursor: pointer;
    transition: all ${theme.transitions.normal};

    ${isLoading && css`
      transition: all ${theme.transitions.normal};
      opacity: 0.4;
      pointer-events: none;
    `}

    ${isDisabled && css`
      transition: all ease-in 0.2s;
      opacity: 0.4;
    `}

    &:hover {
      cursor: pointer;
      box-shadow: ${theme.boxShadows.md};
      transition: all ${theme.transitions.normal};
    }
  `}
`;
