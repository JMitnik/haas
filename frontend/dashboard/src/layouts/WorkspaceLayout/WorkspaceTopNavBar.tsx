import * as UI from '@haas/ui';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import React from 'react';

import { useCustomer } from 'providers/CustomerProvider';
import { useNavigator } from 'hooks/useNavigator';

import { TopSubNavBarContainer } from './TopSubNavBar.styles';

export const WorkspaceTopNavBar = () => {
  const { t } = useTranslation();
  const { activeCustomer } = useCustomer();

  const { dashboardPath, workspaceInteractionsPath } = useNavigator();

  return (
    <TopSubNavBarContainer>
      <UI.Container px={4} pt={4}>
        <UI.Div>
          <UI.ViewTitle>
            {activeCustomer?.name}
          </UI.ViewTitle>
          <UI.ViewSubTitle>
            See how your teams and people are doing.
          </UI.ViewSubTitle>

          <UI.Div pt={4}>
            <UI.Span>
              <NavLink exact to={dashboardPath}>
                Overview
              </NavLink>
            </UI.Span>

            <UI.Span>
              <NavLink to={workspaceInteractionsPath}>
                Interactions
              </NavLink>
            </UI.Span>
          </UI.Div>
        </UI.Div>
      </UI.Container>
    </TopSubNavBarContainer>
  );
};
