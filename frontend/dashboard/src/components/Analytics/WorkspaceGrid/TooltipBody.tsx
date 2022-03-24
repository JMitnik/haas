import * as UI from '@haas/ui';
import { useFormatter } from 'hooks/useFormatter';
import { useTranslation } from 'react-i18next';
import React from 'react';

import {
  HexagonDialogueNode,
  HexagonNode,
  HexagonNodeType,
  HexagonQuestionNodeNode,
  HexagonSessionNode,
} from './WorkspaceGrid.types';

interface TooltipBodyProps {
  node: HexagonNode;
}

export const TooltipDialogueBody = ({ node }: { node: HexagonDialogueNode }) => {
  const { formatScore } = useFormatter();
  const { t } = useTranslation();

  return (
    <UI.Div>
      <UI.Helper>
        {t('dialogue')}
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

export const TooltipQuestionNodeBody = ({ node }: { node: HexagonQuestionNodeNode }) => {
  const { formatScore } = useFormatter();
  const { t } = useTranslation();

  return (
    <UI.Div>
      <UI.Helper>
        {t('topic')}
      </UI.Helper>
      <UI.PaddedBody fraction={0.5}>
        <UI.Flex>
          <UI.Div>
            {formatScore(node.score)}
          </UI.Div>
          <UI.Div ml={2}>
            {node.topic}
          </UI.Div>
        </UI.Flex>
      </UI.PaddedBody>
    </UI.Div>
  );
};

export const TooltipSessionBody = ({ node }: { node: HexagonSessionNode }) => {
  const { formatScore } = useFormatter();
  const { t } = useTranslation();

  return (
    <UI.Div>
      <UI.Helper>
        {t('session')}
      </UI.Helper>
      <UI.PaddedBody fraction={0.5}>
        <UI.Flex>
          <UI.Div>
            {formatScore(node.score)}
          </UI.Div>
          <UI.Div ml={2}>
            {node.id}
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
    case HexagonNodeType.QuestionNode:
      return <TooltipQuestionNodeBody node={node} />;
    case HexagonNodeType.Session:
      return <TooltipSessionBody node={node} />;
    default: {
      return <div>Node</div>;
    }
  }
};

