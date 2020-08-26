import { Div } from '@haas/ui';
import { NavItemContainer, NavItems } from 'components/Sidenav/Sidenav';
import React from 'react';
import styled, { css } from 'styled-components/macro';

const MobileBottomNavContainer = styled(Div)`
	${({ theme }) => css`
    position: fixed;
    height: 80px;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 500;
    background: ${theme.colors.primary};
    display: flex;

    ${NavItems} {
      display: flex;
      align-items: center;
      
      ${NavItemContainer} {
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
