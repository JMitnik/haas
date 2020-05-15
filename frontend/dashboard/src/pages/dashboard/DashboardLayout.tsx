import React from 'react';
import CustomerOverview from 'components/DashboardView';
import { DashboardContainer } from 'components/DashboardView/DashboardViewStyles';
import { Route, Switch, useParams, useHistory } from 'react-router';
import TopicDetail from 'views/TopicDetail/TopicDetail';
import AddTopicView from 'views/AddTopicView';
import CustomerBuilderView from 'views/CustomerBuilderView';
import TopicsOverview from 'views/TopicsOverview/TopicsOverview';
import OrganisationSettingsView from 'views/OrganisationSettingsView';
import Sidenav from 'components/Sidenav';
import DashboardView from 'components/DashboardView';
import Logo from 'assets/Logo';
import { Div, Button } from '@haas/ui';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { topicId, customerId }: { topicId: string, customerId: string } = useParams<any>();
  const history = useHistory();

  const sideNavIsActive = (customerId != undefined && topicId != undefined);
  console.log(sideNavIsActive);

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
