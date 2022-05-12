import * as UI from '@haas/ui';
import { useParams } from 'react-router';
import React from 'react';
import styled, { css } from 'styled-components';

import { CustomThemeProviders } from 'providers/ThemeProvider';
import { ErrorBoundary } from 'react-error-boundary';
import { Loader } from 'components/Common/Loader/Loader';
import { motion } from 'framer-motion';
import { useCustomer } from 'providers/CustomerProvider';
import useMediaDevice from 'hooks/useMediaDevice';

import * as LS from './WorkpaceLayout.styles';
import { WorkspaceNav } from './WorkspaceNav';
import { WorkspaceSidenav } from './WorkspaceSidenav';
import MobileBottomNav from './MobileWorkspaceBottomNav';
import NotAuthorizedView from '../NotAuthorizedView';

const WorkspaceLayoutContainer = styled(UI.Div) <{ isMobile?: boolean }>`
  ${({ theme, isMobile = false }) => css`
    display: grid;
    background: ${theme.colors.app.background};
    min-height: 100vh;
    grid-template-columns: ${theme.sidenav.width}px 1fr;
    grid-gap: ${theme.gutter}px;

    ${isMobile && css`
      grid-template-columns: '1fr';
    `}
  `}
`;

interface WorskpaceLayoutProps {
  children: React.ReactNode;
}

const WorkspaceLayout = ({ children }: WorskpaceLayoutProps) => {
  const params: { topicId: string, customerSlug: string, dialogueSlug: string } = useParams<any>();
  const device = useMediaDevice();
  const { isLoading } = useCustomer();

  return (
    <ErrorBoundary FallbackComponent={NotAuthorizedView}>
      <CustomThemeProviders>
        <WorkspaceLayoutContainer isMobile={device.isSmall}>

          {isLoading && (
            <UI.Div position="absolute" bottom={0} right={0}>
              <Loader testId="runner" />
            </UI.Div>
          )}
          <UI.Div>
            {!device.isSmall ? (
              <motion.div initial={{ x: -30 }} animate={{ x: 0 }} exit={{ x: -30 }}>
                <WorkspaceSidenav />
              </motion.div>
            ) : (
              <MobileBottomNav>
                <WorkspaceNav customerSlug={params.customerSlug} />
              </MobileBottomNav>
            )}
          </UI.Div>

          <LS.DashboardViewContainer>
            {children}
          </LS.DashboardViewContainer>
        </WorkspaceLayoutContainer>
      </CustomThemeProviders>
    </ErrorBoundary>
  );
};

export default WorkspaceLayout;
