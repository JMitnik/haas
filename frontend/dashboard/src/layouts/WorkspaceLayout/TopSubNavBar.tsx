import React from 'react';

import { useNavigator } from 'hooks/useNavigator';

import { DialogueTopNavBar } from './DialogueTopNavBar';
import { WorkspaceTopNavBar } from './WorkspaceTopNavBar';

export const TopSubNavBar = () => {
  const { dashboardScopeMatch, dialogueScopeMatch } = useNavigator();

  if (dashboardScopeMatch) return <WorkspaceTopNavBar />;
  if (dialogueScopeMatch) return <DialogueTopNavBar />;

  return null;
};
