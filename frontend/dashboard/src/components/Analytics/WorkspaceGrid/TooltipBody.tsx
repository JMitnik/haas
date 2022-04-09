import * as UI from '@haas/ui';
import { format } from 'date-fns';
import { useFormatter } from 'hooks/useFormatter';
import { useTranslation } from 'react-i18next';
import React from 'react';

import { Calendar, TrendingDown, TrendingUp } from 'react-feather';
import {
  HexagonDialogueNode,
  HexagonGroupNode,
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
    <UI.Div bg="blue.800" borderRadius={8}>
      <UI.Helper color="white">
        {t('dialogue')}
      </UI.Helper>
      <UI.PaddedBody fraction={0.5}>
        <UI.Flex color="white">
          <UI.Div>
            {formatScore(node.score)}
          </UI.Div>
          <UI.Div ml={2}>
            {node.label}
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

export const TooltipGroupNodeBody = ({ node }: { node: HexagonGroupNode }) => {
  const { t } = useTranslation();
  const { formatScore } = useFormatter();

  return (
    <UI.Div bg="gray.800">
      <UI.Helper>
        {t('group')}
      </UI.Helper>
      <UI.PaddedBody fraction={0.5}>
        <UI.Flex>
          <UI.Div>
            {/* test */}
            {formatScore(node.score)}
          </UI.Div>
          <UI.Div ml={2}>
            {node.label}
          </UI.Div>
        </UI.Flex>
      </UI.PaddedBody>
    </UI.Div>
  );
};

export const TooltipSessionBody = ({ node }: { node: HexagonSessionNode }) => {
  const { formatScore } = useFormatter();
  const { t } = useTranslation();

  const date = format(new Date(node.session.createdAt), 'dd/MM/yyyy HH:mm:ss');

  return (
    <UI.Div>
      <UI.Div>
        <UI.Div borderBottom="1px solid" borderColor="gray.100" pb={1}>
          <UI.Span fontWeight={700}>
            Session
          </UI.Span>
        </UI.Div>
      </UI.Div>
      <UI.PaddedBody fraction={0.5}>
        <UI.Stack spacing={2}>
          <UI.Div>
            <UI.Div mr={1}>
              <UI.Helper>
                {t('score')}
              </UI.Helper>
            </UI.Div>
            <UI.Flex alignItems="center">
              <UI.Icon mr={1}>
                {node.score < 40 ? (
                  <TrendingDown width={16} />
                ) : (
                  <TrendingUp width={16} />
                )}
              </UI.Icon>
              <UI.Div>
                {formatScore(node.score)}
              </UI.Div>
            </UI.Flex>
          </UI.Div>
          <UI.Div>
            <UI.Div>
              <UI.Helper>
                {t('date')}
              </UI.Helper>
            </UI.Div>
            <UI.Flex alignItems="center">
              <UI.Icon display="inline-block" mr={1}>
                <Calendar width={16} />
              </UI.Icon>
              <UI.Muted>
                {date}
              </UI.Muted>
            </UI.Flex>
          </UI.Div>
        </UI.Stack>
      </UI.PaddedBody>
    </UI.Div>
  );
};

export const TooltipBody = ({ node }: TooltipBodyProps) => {
  switch (node.type) {
    case HexagonNodeType.Group:
      return <TooltipGroupNodeBody node={node} />;
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

