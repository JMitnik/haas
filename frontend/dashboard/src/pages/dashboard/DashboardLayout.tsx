import React from 'react';
import CustomerOverview from 'components/DashboardView';
import { DashboardContainer } from 'components/DashboardView/DashboardViewStyles';
import { Route, Switch, useParams } from 'react-router';
import TopicDetail from 'views/TopicDetail/TopicDetail';
import AddTopicView from 'views/AddTopicView';
import CustomerBuilderView from 'views/CustomerBuilderView';
import TopicsOverview from 'views/TopicsOverview/TopicsOverview';
import OrganisationSettingsView from 'views/OrganisationSettingsView';
import Sidenav from 'components/Sidenav';
import DashboardView from 'components/DashboardView';
import Logo from 'assets/Logo';
import { Div } from '@haas/ui';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const params = useParams<any>();


  const sideNavIsActive = (params?.customerId != undefined && params?.topicId != undefined);
  console.log(sideNavIsActive);

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
