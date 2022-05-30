import * as UI from '@haas/ui';
import React from 'react';
import styled, { css } from 'styled-components';

import { CustomThemeProviders } from 'providers/ThemeProvider';
import { ErrorBoundary } from 'react-error-boundary';
import { Loader } from 'components/Common/Loader/Loader';
import { useCustomer } from 'providers/CustomerProvider';
import useMediaDevice from 'hooks/useMediaDevice';

import * as LS from './WorkpaceLayout.styles';
import { TopbarContainer, WorkspaceTopbar } from './WorkspaceTopbar';
import NotAuthorizedView from '../NotAuthorizedView';

const WorkspaceLayoutContainer = styled(UI.Div) <{ isMobile?: boolean }>`
  ${({ theme, isMobile = false }) => css`
    display: grid;
    background: ${theme.colors.app.background};
    min-height: 100vh;

    ${TopbarContainer} {
      max-width: 100%;
      background-color: ${theme.colors.app.sidebar};
      box-shadow: inset 2px 1px 4px 0px rgb(0 0 0 / 10%);
    }

    ${isMobile && css`
      grid-template-columns: '1fr';
    `}
  `}
`;

interface WorskpaceLayoutProps {
  children: React.ReactNode;
}

const WorkspaceLayout = ({ children }: WorskpaceLayoutProps) => {
  const device = useMediaDevice();
  const { isLoading } = useCustomer();

  return (
    <ErrorBoundary FallbackComponent={NotAuthorizedView}>
      <CustomThemeProviders>
        {/* With topbar */}
        {isLoading && (
          <UI.Div position="absolute" bottom={0} right={0}>
            <Loader testId="runner" />
          </UI.Div>
        )}
        <UI.Div position="relative" zIndex={100000}>
          <WorkspaceTopbar withNav />
        </UI.Div>
        <WorkspaceLayoutContainer isMobile={device.isSmall}>
          <LS.DashboardViewContainer>
            {children}
          </LS.DashboardViewContainer>
        </WorkspaceLayoutContainer>
      </CustomThemeProviders>
    </ErrorBoundary>
  );
};

export default WorkspaceLayout;
