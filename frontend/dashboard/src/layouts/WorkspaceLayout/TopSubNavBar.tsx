import React from 'react';

import { useNavigator } from 'hooks/useNavigator';

import { WorkspaceTopNavBar } from './WorkspaceTopNavBar';

export const TopSubNavBar = () => {
  const { dashboardScopeMatch } = useNavigator();

  if (dashboardScopeMatch) return <WorkspaceTopNavBar />;

  return null;
};
