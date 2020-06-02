import React from 'react';
import { DashboardContainer } from 'components/DashboardView/DashboardViewStyles';
import { useParams, useHistory } from 'react-router';
import Sidenav from 'components/Sidenav';
import Logo from 'assets/Logo';
import { Div, Button } from '@haas/ui';

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
        <button onClick={() => history.push(`/dashboard/c/${customerId}/t/${topicId}/`)}>Dashboard</button>
        <button onClick={() => history.push(`/dashboard/c/${customerId}/t/${topicId}/interactions`)}>Interactions overview</button>
      </Sidenav>
      {children}
    </DashboardContainer>
  );
};

export default DashboardLayout;
