import Color from 'color';
import styled, { css } from 'styled-components/macro';

import { Div, H2 } from '@haas/ui';

export const NodeContainer = styled(Div)`
  ${({ theme }) => css`
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    display: flex;
    height: 100%;

    @media (min-width: 601px) {
      height: 90%;
    }
    
    > ${Div} {
      text-align: center;
      width: 100%;
      display: flex;
      justify-content: space-between;
      flex-direction: column;
      height: 100%;
    }

    @media and ${theme.media.desk} {
      height: 90%;
    }
  `}
`;

export const NodeTitle = styled(H2)`
  ${({ theme }) => css`

  color: ${Color(theme.colors.primary).isDark() ? Color(theme.colors.primary).mix(Color('white'), 0.9).saturate(1).hex()
    : Color(theme.colors.primary).mix(Color('black'), 0.5).saturate(1).hex()};
  `}
`;
