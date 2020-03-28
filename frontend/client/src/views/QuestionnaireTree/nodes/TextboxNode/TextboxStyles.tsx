import { Button } from '@haas/ui';
import styled, { css } from 'styled-components/macro';
import { ActiveNodeContainer } from '../NodeStyles';

export const TextboxContainer = styled(ActiveNodeContainer)`
  ${({ theme }) => css`
    height: 100%;

    ${Button} {
      position: absolute;
      right: ${theme.gutter}px;
      bottom: ${theme.gutter}px;
      transform: translateY(-50%);
    }
  `}
`;
