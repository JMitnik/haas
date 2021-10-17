import * as UI from '@haas/ui';
import { Brand } from 'config/theme';

import styled, { css } from 'styled-components';

export interface CircleProps {
  brand?: Brand;
}

export const Circle = styled(UI.Div) <CircleProps>`
  ${({ theme, brand }) => css`
    display: flex;
    flex-shrink: 0;
    align-items: center;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    font-weight: 500;
    height: 40px;
    width: 40px;
    padding: 0;
    border: 2px solid var(--circle-outline-color);
    justify-content: center;
    border-radius: 100px !important;

    ${brand && css`
      background: ${theme.colors[brand][600]};
      color: ${theme.colors[brand][50]};
      font-weight: 700;
      font-size: 1.2rem;
    `}
  `}
`;
