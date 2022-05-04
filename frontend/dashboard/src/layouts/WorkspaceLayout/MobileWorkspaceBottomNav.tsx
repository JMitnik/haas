import * as UI from '@haas/ui';
import React from 'react';
import styled, { css } from 'styled-components';

import * as LS from './WorkpaceLayout.styles';

const MobileBottomNavContainer = styled(UI.Div)`
  ${({ theme }) => css`
    position: fixed;
    height: 80px;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 500;
    background: ${theme.colors.primary};
    display: flex;

    ${LS.NavItems} {
      display: flex;
      align-items: center;

      ${LS.NavItemContainer} {
        margin-top: 0;
      }
    }
  `}
`;

const MobileBottomNav = ({ children }: { children: React.ReactNode }) => (
  <MobileBottomNavContainer>
    {children}
  </MobileBottomNavContainer>
);

export default MobileBottomNav;
