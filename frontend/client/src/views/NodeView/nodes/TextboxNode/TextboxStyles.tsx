import { Div, H2, H3 } from '@haas/ui';
import styled, { css } from 'styled-components/macro';

export const TextboxContainer = styled(Div)`
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
