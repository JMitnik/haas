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
import { useAuth } from 'providers/AuthProvider';
import { useCustomer } from 'providers/CustomerProvider';
import Logo, { FullLogo } from 'components/Logo/Logo';
import Sidenav from 'components/Sidenav';
import useLocalStorage from 'hooks/useLocalStorage';

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

  return (
    <DashboardLayoutContainer>
      <Div>
        <Sidenav>
          <Div>
            <Logo justifyContent="center" />
            <NavItems>
              <NavItem to={`/dashboard/b/${params.customerSlug}/d`}>
                <SurveyIcon />
                Dialogues
              </NavItem>
              <NavItem to={`/dashboard/b/${params.customerSlug}/analytics`}>
                <PieChartIcon />
                Analytics
              </NavItem>
              <NavItem to={`/dashboard/b/${params.customerSlug}/users`}>
                <UsersIcon />
                Users
              </NavItem>
              <NavItem to={`/dashboard/b/${params.customerSlug}/triggers`}>
                <NotificationIcon />
                Alerts
              </NavItem>
              <NavItem to={`/dashboard/b/${params.customerSlug}/edit`}>
                <SettingsIcon />
                Settings
              </NavItem>
            </NavItems>
          </Div>

          <Usernav customer={customer} user={userData} />
        </Sidenav>
      </Div>

      <DashboardViewContainer>
        {children}
      </DashboardViewContainer>
    </DashboardLayoutContainer>
  );
};

export default DashboardLayout;
