import { ViewHeadContainer } from '@haas/ui';
import React from 'react';
import styled, { css } from 'styled-components';

const ReportsLayoutContainer = styled.div`
  ${({ theme }) => css`
    height: 100%;
    min-height: 100vh;
    background: ${theme.colors.app.background};
  `}
`;

interface ReportsLayoutProps {
  children?: React.ReactNode;
}

export const ReportsLayout = ({ children }: ReportsLayoutProps) => (
  <ReportsLayoutContainer>
    {children}
  </ReportsLayoutContainer>
);

export const ReportsHeader = styled.div`
  ${({ theme }) => css`
    background-color: ${theme.colors.neutral[50]};
    box-shadow: inset 0 2px 4px 0 rgb(0 0 0 / 5%);

    ${ViewHeadContainer} {
      background-color: ${theme.colors.neutral[50]};
    }
  `}
`;
