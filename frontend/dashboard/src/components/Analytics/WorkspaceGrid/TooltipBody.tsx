import * as UI from '@haas/ui';
import { useFormatter } from 'hooks/useFormatter';
import React from 'react';

import { HexagonDialogueNode, HexagonNode, HexagonNodeType } from './WorkspaceGrid.types';

interface TooltipBodyProps {
  node: HexagonNode;
}

export const TooltipDialogueBody = ({ node }: { node: HexagonDialogueNode }) => {
  const { formatScore } = useFormatter();

  return (
    <UI.Div>
      <UI.Helper>
        Dialogue
      </UI.Helper>
      <UI.PaddedBody fraction={0.5}>
        <UI.Flex>
          <UI.Div>
            {formatScore(node.score)}
          </UI.Div>
          <UI.Div ml={2}>
            {node.dialogue?.title}
          </UI.Div>
        </UI.Flex>
      </UI.PaddedBody>
    </UI.Div>
  );
};

export const TooltipBody = ({ node }: TooltipBodyProps) => {
  switch (node.type) {
    case HexagonNodeType.Dialogue:
      return <TooltipDialogueBody node={node} />;
    default: {
      return <div>Node</div>;
    }
  }
};

