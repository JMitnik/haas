import * as UI from '@haas/ui';
import { useTranslation } from 'react-i18next';
import React from 'react';

import { Issue } from './WorkspaceGrid.types';
import { SimpleIssueTable } from '../Issues/SimpleIssueTable';

interface IssuesModalProps {
  issues: Issue[];
  isFiltersEnabled: boolean;
  onIssueClick: (issue: Issue) => void;
  onResetFilters: () => void;
}

export const IssuesModal = ({
  issues,
  onIssueClick,
  isFiltersEnabled,
  onResetFilters,
}: IssuesModalProps) => {
  const { t } = useTranslation();
  return (
    <>
      <UI.ModalHead>
        <UI.ModalTitle>
          {t('teams_with_problems')}
        </UI.ModalTitle>
      </UI.ModalHead>
      <UI.ModalBody noPadding>
        <SimpleIssueTable
          issues={issues}
          onResetFilter={onResetFilters}
          inPreview={false}
          isFilterEnabled={isFiltersEnabled}
          onIssueClick={onIssueClick}
        />
      </UI.ModalBody>
    </>
  );
};
