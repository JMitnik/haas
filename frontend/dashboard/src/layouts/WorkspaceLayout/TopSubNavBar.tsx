import React from 'react';

import { useNavigator } from 'hooks/useNavigator';

import { DialogueTopNavBar } from './DialogueTopNavBar';
import { WorkspaceTopNavBar } from './WorkspaceTopNavBar';

export const TopSubNavBar = () => {
  const { dashboardScopeMatch, dialogueScopeMatch, dialogueScopeFeedbackMatch } = useNavigator();

  if (dashboardScopeMatch) return <WorkspaceTopNavBar />;
  if (dialogueScopeMatch || dialogueScopeFeedbackMatch) return <DialogueTopNavBar />;

  return null;
};
