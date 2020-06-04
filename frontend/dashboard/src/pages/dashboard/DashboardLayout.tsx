import { Button, Div } from '@haas/ui';
import { DashboardContainer } from 'components/DashboardView/DashboardViewStyles';
import { useHistory, useParams } from 'react-router';
import Logo from 'assets/Logo';
import React from 'react';
import Sidenav from 'components/Sidenav';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { topicId, customerId }: { topicId: string, customerId: string } = useParams<any>();
  const history = useHistory();
  const sideNavIsActive = (customerId != undefined && topicId != undefined);

  return (
    <DashboardContainer>
      <Sidenav isActive={sideNavIsActive}>
        {/* Topside */}
        <Div>
          <Logo isWhite={sideNavIsActive} />
        </Div>
        <button type="button" onClick={() => history.push(`/dashboard/c/${customerId}/t/${topicId}/`)}>Dashboard</button>
        <button type="button" onClick={() => history.push(`/dashboard/c/${customerId}/users/`)}>Users</button>
        <button type="button" onClick={() => history.push(`/dashboard/c/${customerId}/t/${topicId}/interactions`)}>Interactions overview</button>
      </Sidenav>
      {children}
    </DashboardContainer>
  );
};

export default DashboardLayout;
