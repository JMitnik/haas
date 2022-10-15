import * as UI from '@haas/ui';
import { useLocation } from 'react-router-dom';
import React, { useState } from 'react';
import styled, { css } from 'styled-components';

import * as Modal from 'components/Common/Modal';
import { CustomThemeProviders } from 'providers/ThemeProvider';
import { Loader } from 'components/Common/Loader/Loader';
import { useCustomer } from 'providers/CustomerProvider';
import { useUser } from 'providers/UserProvider';
import useMediaDevice from 'hooks/useMediaDevice';

import * as LS from './WorkpaceLayout.styles';
import { ReleaseModalCard } from './ReleaseModalCard';
import { TopSubNavBar } from './TopSubNavBar';
import { TopbarContainer, WorkspaceTopbar } from './WorkspaceTopbar';

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
  const location = useLocation();
  const { userTours, finishTour, user } = useUser();
  const [userTourId, setUserTourId] = useState(userTours?.releaseTour?.id);

  const isReportView = location.pathname.includes('_reports');

  const hideTop = isReportView;

  const hasReleaseTour = !!userTourId;

  return (
    <CustomThemeProviders>
      {/* With topbar */}
      {isLoading && (
        <UI.Div position="absolute" bottom={0} right={0}>
          <Loader testId="runner" />
        </UI.Div>
      )}
      {!hideTop && (
        <UI.Div
          style={{
            boxShadow: '2px 2px 2px rgba(0, 0, 0, 0.03)',
          }}
          position="relative"
          zIndex={100000}
        >
          <WorkspaceTopbar withNav />
          <TopSubNavBar />
        </UI.Div>
      )}
      <WorkspaceLayoutContainer isMobile={device.isSmall}>
        <Modal.Root
          open={hasReleaseTour}
          onClose={() => finishTour({
            variables: {
              input: {
                userId: user?.id as string,
                userTourId: userTours?.releaseTour?.id as string,
              },
            },
          })}
        >
          <ReleaseModalCard
            userId={user?.id as string}
            release={userTours?.releaseTour}
            onTourChange={setUserTourId}
          />
        </Modal.Root>
        <LS.DashboardViewContainer>
          {children}
        </LS.DashboardViewContainer>
      </WorkspaceLayoutContainer>
    </CustomThemeProviders>
  );
};

export default WorkspaceLayout;
