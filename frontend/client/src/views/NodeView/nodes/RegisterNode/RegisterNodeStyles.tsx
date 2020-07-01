import { Div, H2 } from '@haas/ui';
import styled, { css } from 'styled-components/macro';

export const RegisterNodeContainer = styled(Div)`
  ${({ theme }) => css`
    @media ${theme.media.mob} {
      ${H2} {
        font-size: 1.5em;
      }
    }

    input {
      font-size: ${theme.fontSizes[1]}px;
      width: 100%;
      resize: none;
    }
  `}
`;
