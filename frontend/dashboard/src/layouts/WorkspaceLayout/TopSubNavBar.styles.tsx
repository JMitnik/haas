import * as UI from '@haas/ui';
import styled, { css } from 'styled-components';

export const TopSubNavBarContainer = styled(UI.Div)`
  ${({ theme }) => css`
    background-color: ${theme.colors.app.background};
    border-bottom: 1px solid ${theme.colors.gray[200]};

    span a {
      color: ${theme.colors.off[300]};
      font-weight: 600;
      font-size: 1rem;
      margin-right: 20px;
      padding-bottom: 6px;
      display: inline-block;
      border-bottom: 2px solid transparent;

      &.active {
        color: ${theme.colors.main[500]};
        border-bottom-color: ${theme.colors.main[500]};
      }
    }
  `}
`;
