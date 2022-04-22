import { Container, Div } from '@haas/ui';

import { LogoContainer } from 'components/Logo/Logo';
import Logo from 'components/Logo';
import React from 'react';
import styled, { css } from 'styled-components';

import { Usernav, UsernavContainer } from '../components/Sidenav/Sidenav';

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

    ${LogoContainer} svg path {
      fill: ${theme.colors.gray[500]} !important;
    }
  `}
`;

const PreCustomerLayout = ({ hideUserNav, children }: PreCustomerLayoutProps) => (
  <PreCustomerLayoutContainer>
    <Container mb="48px">
      <Logo justifyContent="flex-start" />
    </Container>
    {!hideUserNav && (
      <Usernav />
    )}

    {children}
  </PreCustomerLayoutContainer>
);

export default PreCustomerLayout;
