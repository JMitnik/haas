import * as UI from '@haas/ui';
import React from 'react';

import { HexagonDialogueNode, HexagonNode, HexagonNodeType } from './WorkspaceGrid.types';

interface TooltipBodyProps {
  node: HexagonNode;
}

export const TooltipDialogueBody = ({ node }: { node: HexagonDialogueNode }) => (
  <UI.Div>
    <UI.Helper>
      Dialogue
    </UI.Helper>
    <UI.PaddedBody fraction={0.5}>
      <UI.Flex>
        <UI.Div>
          {node.score.toFixed(2)}
        </UI.Div>
        <UI.Div ml={2}>
          {node.dialogue?.title}
        </UI.Div>
      </UI.Flex>
    </UI.PaddedBody>
  </UI.Div>
);

export const TooltipBody = ({ node }: TooltipBodyProps) => {
  switch (node.type) {
    case HexagonNodeType.Dialogue:
      return <TooltipDialogueBody node={node} />;
    default: {
      return <div>Node</div>;
    }
  }
};

