import * as UI from '@haas/ui';
import { reverse } from 'lodash';
import React, { useMemo } from 'react';

import { DialogueDetailsPane } from './DialogueDetailsPane';
import { HexagonNodeType, HexagonState } from './WorkspaceGrid.types';
import { TopicDetailsPane } from './TopicDetailsPane';

interface WorkspaceGridPaneProps {
  stateHistory: HexagonState[];
}

export const WorkspaceGridPane = ({ stateHistory }: WorkspaceGridPaneProps) => {
  const reversedStateHistory = useMemo(() => (
    reverse(stateHistory)
  ), [stateHistory]);

  return (
    <UI.Div bg="white" borderLeft="1px solid" borderLeftColor="gray.200">
      <UI.Stack
        spacing={2}
      >
        {reversedStateHistory.map((state, index) => (
          <React.Fragment key={index}>
            {state.selectedNode?.type === HexagonNodeType.Dialogue && (
              <DialogueDetailsPane dialogue={state.selectedNode.dialogue} />
            )}

            {state.selectedNode?.type === HexagonNodeType.QuestionNode && (
              <TopicDetailsPane topic={state.selectedNode.topic} impactScore={state.selectedNode.score} />
            )}
          </React.Fragment>
        ))}
      </UI.Stack>

      {stateHistory.length === 0 && (
        <UI.ColumnFlex height="100%" justifyContent="center" alignItems="center">
          <UI.Text fontSize="1.2rem" color="gray.500" fontWeight={300}>
            Select a dialogue for more insights.
          </UI.Text>
        </UI.ColumnFlex>
      )}
    </UI.Div>
  );
};
