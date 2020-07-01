import { Div, H2, H3 } from '@haas/ui';
import styled, { css } from 'styled-components/macro';

export const TextboxContainer = styled(Div)`
  ${({ theme }) => css`
    height: 100%;

    textarea::after {
      content: '';
      position: absolute;
      width: 0;
      height: 0;
      bottom: 100%;
      left: 1.5em; // offset should move with padding of parent
      border: .75rem solid transparent;
      border-top: none;

      // looks
      border-bottom-color: #fff;
      filter: drop-shadow(0 -0.0625rem 0.0625rem rgba(0, 0, 0, .1));
    }

    @media ${theme.media.mob} {
      ${H2} {
        font-size: 1.5em;
      }

      ${H3} {
        font-size: 1.2em;
      }
    }
  `}
`;
