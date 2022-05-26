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
      <UI.H1 fontWeight="900" pt={4} color="off.500" lineHeight="1.2">
        {title}
      </UI.H1>
      {previousStateLabels.length > 0 && (
        <UI.Span color="off.400" fontSize="1.1rem">
          <UI.Flex justifyContent="center">
            <UI.Span mr={1}>
              in
            </UI.Span>
            {previousStateLabels.map((label, index) => (
              <UI.Span key={`${label}-${index}`} color="off.400" fontSize="1.1rem">
                {label}
                <UI.Span mx={1}>
                  {index < previousStateLabels.length - 1 && (
                    <UI.Icon>
                      <ChevronRight width={14} />
                    </UI.Icon>
                  )}
                </UI.Span>
              </UI.Span>
            ))}
          </UI.Flex>
        </UI.Span>
      )}
      {/* {currentState.} */}
    </UI.Div>
  );
};
