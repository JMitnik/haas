import styled, { css } from 'styled-components/macro';
import { ActiveNodeContainer } from '../NodeStyles';
import { H2 } from '@haas/ui';

export const RegisterNodeContainer = styled(ActiveNodeContainer)`
  ${({ theme }) => css`
    height: 100%;

    ${H2} {
      font-size: 1.2em;
    }

    input {
      border-radius: 30px;
      border: 1px solid ${theme.colors.primary};
      font-size: ${theme.fontSizes[1]}px;
      width: 100%;
      resize: none;
    }
  `}
`;
