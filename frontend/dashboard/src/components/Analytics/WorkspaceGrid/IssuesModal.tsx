import * as UI from '@haas/ui';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { SimpleIssueTable } from '../Issues/SimpleIssueTable';
import { Issue } from './WorkspaceGrid.types';

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
          {t('issues')}
        </UI.ModalTitle>
      </UI.ModalHead>
      <UI.ModalBody>
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
