import styled, { css } from 'styled-components/macro';

import { Div, H2 } from '@haas/ui';

export const FloatingNodeContainer = styled(Div)`
  ${({ theme }) => css`
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    display: flex;
    height: 95%;

    @media and ${theme.media.desk} {
      height: 90%;
    }
  `}
`;

export const ActiveNodeContainer = styled(Div)`
  ${({ theme }) => css`
    display: flex;
    flex-direction: column;
    width: 100%;
    justify-content: space-between;

    ${H2} {
      color: white;
      text-align: center;

      @media ${theme.media.mob} {
        font-size: 30px;
      }
    }
  `}
`;
