import * as UI from '@haas/ui';
import { useTranslation } from 'react-i18next';
import React from 'react';

import { HexagonState } from './WorkspaceGrid.types';
import { getTitleKey } from './WorkspaceGrid.helpers';

interface WorkspaceGridHeaderProps {
  workspaceName: string;
  currentState: HexagonState;
}

export const WorkspaceGridHeader = ({
  workspaceName,
  currentState,
}: WorkspaceGridHeaderProps) => {
  const { t } = useTranslation();

  const titleKey = getTitleKey(currentState);
  const title = titleKey !== 'workspace' ? t(titleKey) : workspaceName;

  return (
    <UI.Div>
      <UI.H1 fontWeight="900" pt={4} color="off.500" lineHeight="1.2">
        {title}
      </UI.H1>
      {/* {currentState.} */}
      {/* <UI.Text color="off.400" fontSize="1.1rem">
        in Amsterdam - Taxes
      </UI.Text> */}
    </UI.Div>
  );
};
