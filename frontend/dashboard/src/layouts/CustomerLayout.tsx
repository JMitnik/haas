import { useParams } from 'react-router';
import React from 'react';
import styled, { css } from 'styled-components/macro';

import { CustomThemeProviders } from 'providers/ThemeProvider';
import { Div, PageHeading } from '@haas/ui';
import { ErrorBoundary } from 'react-error-boundary';
import { NavItem, NavItems, Usernav } from 'components/Sidenav/Sidenav';
import { ReactComponent as NotificationIcon } from 'assets/icons/icon-notification.svg';
import { ReactComponent as PieChartIcon } from 'assets/icons/icon-pie-chart.svg';
import { ReactComponent as SettingsIcon } from 'assets/icons/icon-cog.svg';
import { ReactComponent as SurveyIcon } from 'assets/icons/icon-survey.svg';
import { ReactComponent as UsersIcon } from 'assets/icons/icon-user-group.svg';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Logo from 'components/Logo/Logo';
import MobileBottomNav from 'components/MobileBottomNav';
import Sidenav from 'components/Sidenav';
import useAuth from 'hooks/useAuth';
import useMediaDevice from 'hooks/useMediaDevice';

import NotAuthorizedView from './NotAuthorizedView';

const CustomerLayoutContainer = styled(Div)<{ isMobile?: boolean }>`
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
    ${PageHeading} {
      color: ${theme.colors.app.onDefault};
    }
  `}
`;

const DashboardNav = ({ customerSlug }: { customerSlug: string }) => {
  const { t } = useTranslation();
  const { canViewUsers, canEditCustomer, canCreateTriggers } = useAuth();

  return (
    <NavItems>
      <NavItem to={`/dashboard/b/${customerSlug}/d`}>
        <SurveyIcon />
        {t('dialogues')}
      </NavItem>
      <NavItem to={`/dashboard/b/${customerSlug}/analytics`}>
        <PieChartIcon />
        {t('analytics')}
      </NavItem>
      {canViewUsers && (
        <NavItem to={`/dashboard/b/${customerSlug}/users`}>
          <UsersIcon />
          {t('users')}
        </NavItem>
      )}
      {canCreateTriggers && (
        <NavItem to={`/dashboard/b/${customerSlug}/triggers`}>
          <NotificationIcon />
          {t('alerts')}
        </NavItem>
      )}
      {canEditCustomer && (
        <NavItem to={`/dashboard/b/${customerSlug}/edit`}>
          <SettingsIcon />
          {t('settings')}
        </NavItem>
      )}
    </NavItems>
  );
};

const CustomerLayout = ({ children }: { children: React.ReactNode }) => {
  const params: { topicId: string, customerSlug: string, dialogueSlug: string } = useParams<any>();
  const device = useMediaDevice();

  return (
    <ErrorBoundary FallbackComponent={NotAuthorizedView}>
      <CustomThemeProviders>

        <CustomerLayoutContainer isMobile={device.isSmall}>
          <Div>
            {!device.isSmall ? (
              <motion.div initial={{ x: -30 }} animate={{ x: 0 }} exit={{ x: -30 }}>
                <Sidenav>
                  <Div>
                    <Logo justifyContent="center" />
                    <DashboardNav customerSlug={params.customerSlug} />
                  </Div>

                  <Usernav />
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
        </CustomerLayoutContainer>
      </CustomThemeProviders>
    </ErrorBoundary>
  );
};

export default CustomerLayout;
