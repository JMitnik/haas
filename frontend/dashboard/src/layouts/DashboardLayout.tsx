import { useParams } from 'react-router';
import React from 'react';
import styled, { css } from 'styled-components/macro';

import { Div, PageHeading } from '@haas/ui';
import { NavItem, NavItems, Usernav } from 'components/Sidenav/Sidenav';
import { ReactComponent as NotificationIcon } from 'assets/icons/icon-notification.svg';
import { ReactComponent as PieChartIcon } from 'assets/icons/icon-pie-chart.svg';
import { ReactComponent as SettingsIcon } from 'assets/icons/icon-cog.svg';
import { ReactComponent as SurveyIcon } from 'assets/icons/icon-survey.svg';
import { UserProps } from 'types/generic';
import { ReactComponent as UsersIcon } from 'assets/icons/icon-user-group.svg';
import { motion } from 'framer-motion';
import { useAuth } from 'providers/AuthProvider';
import { useCustomer } from 'providers/CustomerProvider';
import Logo from 'components/Logo/Logo';
import MobileBottomNav from 'components/MobileBottomNav';
import Sidenav from 'components/Sidenav';
import useLocalStorage from 'hooks/useLocalStorage';
import useMediaDevice from 'hooks/useMediaDevice';

const DashboardLayoutContainer = styled(Div)<{ isMobile?: boolean }>`
  ${({ theme, isMobile = false }) => css`
    display: grid;
    background: ${theme.colors.app.background};
    min-height: 100vh;

    ${isMobile ? css`
      grid-template-columns: '1fr';      
    ` : css`
      grid-template-columns: ${theme.sidenav.width}px 1fr;
    `}
    
  `}
`;

const DashboardViewContainer = styled(Div)`
  ${({ theme }) => css`
    /* padding: ${theme.gutter * 2}px ${theme.gutter * 4}px; */

    ${PageHeading} {
      color: ${theme.colors.app.onDefault};
    }
  `}
`;

const DashboardNav = ({ customerSlug }: { customerSlug: string }) => (
  <NavItems>
    <NavItem to={`/dashboard/b/${customerSlug}/d`}>
      <SurveyIcon />
      Dialogues
    </NavItem>
    <NavItem to={`/dashboard/b/${customerSlug}/analytics`}>
      <PieChartIcon />
      Analytics
    </NavItem>
    <NavItem to={`/dashboard/b/${customerSlug}/users`}>
      <UsersIcon />
      Users
    </NavItem>
    <NavItem to={`/dashboard/b/${customerSlug}/triggers`}>
      <NotificationIcon />
      Alerts
    </NavItem>
    <NavItem to={`/dashboard/b/${customerSlug}/edit`}>
      <SettingsIcon />
      Settings
    </NavItem>
  </NavItems>
);

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const params: { topicId: string, customerSlug: string, dialogueSlug: string } = useParams<any>();
  const { activeCustomer } = useCustomer();
  const [storageCustomer] = useLocalStorage('customer', '');
  const { user } = useAuth();

  const customer = activeCustomer || storageCustomer;

  const userData: UserProps = {
    firstName: user?.firstName || 'HAAS',
    lastName: user?.lastName || 'Admin',
    business: {
      name: customer?.name || '',
    },
  };

  const device = useMediaDevice();

  return (
    <DashboardLayoutContainer isMobile={device.isSmall}>
      <Div>
        {!device.isSmall ? (
          <motion.div initial={{ x: -30 }} animate={{ x: 0 }} exit={{ x: -30 }}>
            <Sidenav>
              <Div>
                <Logo justifyContent="center" />
                <DashboardNav customerSlug={params.customerSlug} />
              </Div>

              <Usernav
                customer={customer}
                user={userData}
              />
            </Sidenav>
          </motion.div>
        ) : (
          <MobileBottomNav>
            <DashboardNav customerSlug={params.customerSlug} />
          </MobileBottomNav>
        )}
      </Div>

      <DashboardViewContainer>
        {children}
      </DashboardViewContainer>
    </DashboardLayoutContainer>
  );
};

export default DashboardLayout;
