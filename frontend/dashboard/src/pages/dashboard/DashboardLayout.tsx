import React from 'react';
import { DashboardContainer } from 'components/DashboardView/DashboardViewStyles';
import { useParams } from 'react-router';
import Sidenav from 'components/Sidenav';
import Logo from 'assets/Logo';
import { Div } from '@haas/ui';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const params = useParams<any>();
  const sideNavIsActive = (params?.customerId != undefined && params?.topicId != undefined);

  return (
    <DashboardContainer>
      <Sidenav isActive={sideNavIsActive}>
        {/* Topside */}
        <Div>
          <Logo isWhite={sideNavIsActive} />
        </Div>
      </Sidenav>
      {children}
    </DashboardContainer>
  );
};

export default DashboardLayout;
