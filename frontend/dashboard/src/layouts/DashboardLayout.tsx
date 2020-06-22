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
import Sidenav from 'components/Sidenav';

const sampleUser: UserProps = {
  firstName: 'Daan',
  lastName: 'Helsloot',
  business: {
    name: 'Starbucks',
  },
};

const DashboardLayoutContainer = styled.div`
  ${({ theme }) => css`
    display: grid;
    grid-template-columns: ${theme.sidenav.width}px 1fr;
    background: ${theme.colors.app.background};
    height: 100vh;
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
  const { customerId }: { topicId: string, customerId: string } = useParams<any>();

  return (
    <DashboardLayoutContainer>
      <Sidenav>
        <Div>
          <NavLogo />

          <NavItems>
            <NavItem to="/dashboard">
              <SurveyIcon />
              Dialogues
            </NavItem>
            <NavItem to={`/dashboard/c/${customerId}/analytics`}>
              <PieChartIcon />
              Analytics
            </NavItem>
            <NavItem to={`/dashboard/c/${customerId}/users`}>
              <UsersIcon />
              Users
            </NavItem>
            <NavItem to={`/dashboard/c/${customerId}/notifications`}>
              <NotificationIcon />
              Alerts
            </NavItem>
            <NavItem to={`/dashboard/c/${customerId}/settings`}>
              <SettingsIcon />
              Settings
            </NavItem>
          </NavItems>
        </Div>

        <Usernav user={sampleUser} />
      </Sidenav>

      <DashboardViewContainer>
        {children}
      </DashboardViewContainer>
    </DashboardLayoutContainer>
  );
};

export default DashboardLayout;
