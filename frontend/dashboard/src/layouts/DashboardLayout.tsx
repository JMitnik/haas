import { useParams } from 'react-router';
import React from 'react';

import { DashboardContainer } from 'views/DashboardView/DashboardViewStyles';
import { NavItem, NavItems, Usernav } from 'components/Sidenav/Sidenav';
import { UserProps } from 'types/generic';
import Logo from 'components/Logo';
import Sidenav from 'components/Sidenav';

const sampleUser: UserProps = {
  firstName: 'Daan',
  lastName: 'Helsloot',
  business: {
    name: 'Starbucks',
  },
};

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { topicId, customerId }: { topicId: string, customerId: string } = useParams<any>();

  return (
    <DashboardContainer>
      <Sidenav>
        <Logo />
        <NavItems>
          <NavItem to="/dashboard">Dialogues</NavItem>
          <NavItem to={`/dashboard/c/${customerId}/t/${topicId}/`}>Analytics</NavItem>
          <NavItem to={`/dashboard/c/${customerId}/t/${topicId}/`}>Users</NavItem>
          <NavItem to={`/dashboard/c/${customerId}/t/${topicId}/`}>Notifications</NavItem>
          <NavItem to={`/dashboard/c/${customerId}/t/${topicId}/`}>Settings</NavItem>
        </NavItems>

        <Usernav user={sampleUser} />

      </Sidenav>
      {children}
    </DashboardContainer>
  );
};

export default DashboardLayout;
