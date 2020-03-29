import { Button, H3, H2 } from '@haas/ui';
import styled, { css } from 'styled-components/macro';
import { ActiveNodeContainer } from '../NodeStyles';

export const TextboxContainer = styled(ActiveNodeContainer)`
  ${({ theme }) => css`
    height: 100%;

    @media ${theme.media.mob} {
      ${H2} {
        font-size: 1.2em;
      }

      ${H3} {
        font-size: 1em;
      }
    }
  `}
`;
