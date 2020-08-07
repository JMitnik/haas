import { useParams } from 'react-router';
import React from 'react';
import styled, { css } from 'styled-components/macro';

import { Div, PageHeading } from '@haas/ui';
import { NavItem, NavItems, NavLogo, Usernav } from 'components/Sidenav/Sidenav';
import { ReactComponent as NotificationIcon } from 'assets/icons/icon-notification.svg';
import { ReactComponent as PieChartIcon } from 'assets/icons/icon-pie-chart.svg';
import { ReactComponent as SettingsIcon } from 'assets/icons/icon-cog.svg';
import { ReactComponent as SurveyIcon } from 'assets/icons/icon-survey.svg';
import { UserProps } from 'types/generic';
import { ReactComponent as UsersIcon } from 'assets/icons/icon-user-group.svg';
import { useCustomer } from 'providers/CustomerProvider';
import Sidenav from 'components/Sidenav';
import useLocalStorage from 'hooks/useLocalStorage';
import { useAuth } from 'providers/AuthProvider';

const DashboardLayoutContainer = styled.div`
  ${({ theme }) => css`
    display: grid;
    grid-template-columns: ${theme.sidenav.width}px 1fr;
    background: ${theme.colors.app.background};
    min-height: 100vh;
  `}
`;

const DashboardViewContainer = styled(Div)`
  ${({ theme }) => css`
    padding: ${theme.gutter * 2}px ${theme.gutter * 4}px;

    ${PageHeading} {
      color: ${theme.colors.app.onDefault};
    }
  `}
`;

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { customerSlug }: { topicId: string, customerSlug: string } = useParams<any>();
  const { activeCustomer } = useCustomer();
  const [storageCustomer] = useLocalStorage('customer', '');
  const { user } = useAuth();

  const userData: UserProps = {
    firstName: user.firstName || 'Test',
    lastName: user.lastName || 'User',
    business: {
      name: activeCustomer?.name || storageCustomer?.name || '',
    },
  };

  return (
    <DashboardLayoutContainer>
      <Div>
        <Sidenav>
          <Div>
            <NavLogo />
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
          </Div>

          <Usernav user={userData} />
        </Sidenav>
      </Div>

      <DashboardViewContainer>
        {children}
      </DashboardViewContainer>
    </DashboardLayoutContainer>
  );
};

export default DashboardLayout;
