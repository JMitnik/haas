import { useParams } from 'react-router';
import React from 'react';
import styled, { css } from 'styled-components/macro';

import { DashboardContainer } from 'views/DashboardView/DashboardViewStyles';
import { Div, Flex, Span } from '@haas/ui';
import { NavItem, NavItems, Usernav } from 'components/Sidenav/Sidenav';
import { ReactComponent as NotificationIcon } from 'assets/icons/icon-notification.svg';
import { ReactComponent as PieChartIcon } from 'assets/icons/icon-pie-chart.svg';
import { ReactComponent as SettingsIcon } from 'assets/icons/icon-cog.svg';
import { ReactComponent as SurveyIcon } from 'assets/icons/icon-survey.svg';
import { UserProps } from 'types/generic';
import { ReactComponent as UsersIcon } from 'assets/icons/icon-user-group.svg';
import Logo from 'components/Logo';
import Sidenav from 'components/Sidenav';

const sampleUser: UserProps = {
  firstName: 'Daan',
  lastName: 'Helsloot',
  business: {
    name: 'Starbucks',
  },
};

const DashboardViewContainer = styled(Div)`
  ${({ theme }) => css`
    padding: ${theme.gutter}px ${theme.gutter * 2}px;
  `}
`;

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { topicId, customerId }: { topicId: string, customerId: string } = useParams<any>();

  return (
    <DashboardContainer>
      <Sidenav>
        <Div>
          <Flex justifyContent="center" alignItems="flex-end">
            {/* TODO: Make generic */}
            <Logo fill="#426b3a" />

            <Div>
              <Span fontSize="2rem" color="primary">
                <Span fontSize="1em" display="block" fontWeight="bold">haas</Span>
                <Span fontSize="0.6em" display="block">dashboard</Span>
              </Span>
            </Div>
          </Flex>

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
    </DashboardContainer>
  );
};

export default DashboardLayout;
