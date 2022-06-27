import * as UI from '@haas/ui';
import { AlertTriangle } from 'react-feather';
import React from 'react';

import { ActionType, Issue } from './SimpleIssueTable.types';
import { ContactActionLabel } from './IssueActionLabels.styles';

interface IssueActionLabelsProps {
  issue: Issue;
}

export const IssueActionLabels = ({ issue }: IssueActionLabelsProps) => {
  if (issue.action === ActionType.Contact) {
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
