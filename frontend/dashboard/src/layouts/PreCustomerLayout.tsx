import { Container, Div } from '@haas/ui';

import { LogoIcon } from 'components/Logo';
import { LogoIconContainer } from 'components/Logo/Logo';
import React from 'react';
import styled, { css } from 'styled-components';

import { Usernav, UsernavContainer } from './WorkspaceLayout/UserNav';

interface PreCustomerLayoutProps {
  children: React.ReactNode;
  hideUserNav?: boolean;
}

const PreCustomerLayoutContainer = styled(Div)`
  ${({ theme }) => css`
    padding: ${theme.gutter}px;

    ${UsernavContainer} {
      position: fixed;
      z-index: 1200;
      bottom: ${theme.gutter}px;
      left: ${theme.gutter}px;
    }

    ${LogoIconContainer} svg path {
      fill: ${theme.colors.gray[500]} !important;
    }
  `}
`;

const PreCustomerLayout = ({ hideUserNav, children }: PreCustomerLayoutProps) => (
  <PreCustomerLayoutContainer>
    <Container mb="48px">
      <LogoIcon justifyContent="flex-start" />
    </Container>
    {!hideUserNav && (
      <Usernav />
    )}

    {children}
  </PreCustomerLayoutContainer>
);

export default PreCustomerLayout;
