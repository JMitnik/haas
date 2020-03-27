import { Button } from '@haas/ui';
import styled, { css } from 'styled-components/macro';

export const TextboxContainer = styled.div`
  ${({ theme }) => css`
    ${Button} {
      position: absolute;
      right: ${theme.gutter}px;
      bottom: ${theme.gutter}px;
      transform: translateY(-50%);
    }
  `}
`;
