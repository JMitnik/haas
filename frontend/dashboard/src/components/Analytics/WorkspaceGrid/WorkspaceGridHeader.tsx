import * as UI from '@haas/ui';
import { useTranslation } from 'react-i18next';
import React from 'react';

import { ChevronRight } from 'react-feather';
import { HexagonState } from './WorkspaceGrid.types';
import { getTitleKey } from './WorkspaceGrid.helpers';

interface WorkspaceGridHeaderProps {
  workspaceName: string;
  currentState: HexagonState;
  previousStateLabels: string[];
}

export const WorkspaceGridHeader = ({
  workspaceName,
  currentState,
  previousStateLabels,
}: WorkspaceGridHeaderProps) => {
  const { t } = useTranslation();

  const titleKey = getTitleKey(currentState);
  const title = titleKey !== 'workspace' ? t(titleKey) : workspaceName;

  return (
    <UI.Div>
      <UI.H1 textAlign="left" fontWeight="900" pt={4} color="off.500" lineHeight="1.2">
        {workspaceName}
      </UI.H1>
    </UI.Div>
  );
};
