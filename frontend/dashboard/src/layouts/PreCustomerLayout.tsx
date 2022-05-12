import * as UI from '@haas/ui';
import React from 'react';
import styled, { css } from 'styled-components';

import { LogoContainer, LogoIconContainer } from 'components/Logo/Logo';

import { TopbarContainer, WorkspaceTopbar } from './WorkspaceLayout/WorkspaceTopbar';
import { UsernavContainer } from './WorkspaceLayout/UserNav';

interface PreCustomerLayoutProps {
  children: React.ReactNode;
}

const PreCustomerLayoutContainer = styled(UI.Div)`
  ${({ theme }) => css`
    background-color: ${theme.colors.app.background};
    min-height: 100vh;

    ${TopbarContainer} {
      max-width: 100%;
      background-color: ${theme.colors.app.sidebar};
      box-shadow: inset 2px 1px 4px 0px rgb(0 0 0 / 10%);
    }

    ${UsernavContainer} {
      position: fixed;
      z-index: 1200;
      bottom: ${theme.gutter}px;
      left: ${theme.gutter}px;
    }

    ${LogoIconContainer} svg path {
      fill: ${theme.colors.off[500]} !important;
    }

    ${LogoContainer} {
      padding: ${theme.gutter / 2}px;
    }
  `}
`;

const PreCustomerLayout = ({ children }: PreCustomerLayoutProps) => (
  <PreCustomerLayoutContainer>
    <WorkspaceTopbar />

    {children}
  </PreCustomerLayoutContainer>
);

export default PreCustomerLayout;
