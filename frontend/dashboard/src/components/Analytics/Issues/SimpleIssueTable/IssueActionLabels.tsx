import * as UI from '@haas/ui';
import { AlertTriangle } from 'react-feather';
import React from 'react';

import { Issue } from 'components/Analytics/WorkspaceGrid/WorkspaceGrid.types';

import { ActionType } from './SimpleIssueTable.types';
import { ContactActionLabel } from './IssueActionLabels.styles';
import { SessionActionType } from 'types/generated-types';

interface IssueActionLabelsProps {
  issue: Issue;
}

export const IssueActionLabels = ({ issue }: IssueActionLabelsProps) => {
  if (issue.followUpAction === SessionActionType.Contact) {
    return (
      <ContactActionLabel>
        <UI.Flex alignItems="center">
          <UI.Icon>
            <AlertTriangle />
          </UI.Icon>
          Urgent
        </UI.Flex>
      </ContactActionLabel>
    );
  }

  return null;
};
