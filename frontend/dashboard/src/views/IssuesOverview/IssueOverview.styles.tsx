import * as UI from '@haas/ui';
import styled, { css } from 'styled-components';

export const UrgentContainer = styled(UI.Div) <{ hasUrgent?: boolean }>`
  ${({ theme, hasUrgent }) => css`
    display: flex;
    width: fit-content;
    align-items: center;
    border-radius: ${theme.borderRadiuses.sm}px;
    font-weight: 700;
    padding: 0.5em;
    text-align: center;
    
    background: ${theme.colors.off[100]};
    color: ${theme.colors.off[500]};

    ${hasUrgent && css`
      background: ${theme.colors.red[100]};
      color: ${theme.colors.red[500]};
    `}
   

  `}
`;
