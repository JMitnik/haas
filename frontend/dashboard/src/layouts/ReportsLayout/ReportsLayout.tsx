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

export const ReportsLayout = ({ children }) => (
  <ReportsLayoutContainer>
    {children}
  </ReportsLayoutContainer>
);
