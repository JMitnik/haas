import { useHistory, useParams } from 'react-router';
import React from 'react';

import { DashboardContainer } from 'components/DashboardView/DashboardViewStyles';
import { Div } from '@haas/ui';
import Logo from 'assets/Logo';
import Sidenav from 'components/Sidenav';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { topicId, customerId }: { topicId: string, customerId: string } = useParams<any>();
  const history = useHistory();
  const sideNavIsActive = (customerId !== undefined && topicId !== undefined);

  return (
    <DashboardContainer>
      <Sidenav isActive={sideNavIsActive}>
        {/* Topside */}
        <Div>
          <Logo isWhite={sideNavIsActive} />
        </Div>

        {/* TODO: Make these into actual navlinks */}
        {sideNavIsActive && (
          <>
            <button type="button" onClick={() => history.push(`/dashboard/c/${customerId}/t/${topicId}/`)}>
              Dashboard
            </button>
            <button type="button" onClick={() => history.push(`/dashboard/c/${customerId}/t/${topicId}/interactions`)}>
              Interactions overview
            </button>
          </>
        )}
      </Sidenav>
      {children}
    </DashboardContainer>
  );
};

export default DashboardLayout;
