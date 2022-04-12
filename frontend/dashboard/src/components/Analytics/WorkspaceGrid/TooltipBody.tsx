import * as UI from '@haas/ui';
import { format } from 'date-fns';
import { useFormatter } from 'hooks/useFormatter';
import { useTranslation } from 'react-i18next';
import React from 'react';

import * as LS from './WorkspaceGrid.styles';
import {
  HexagonDialogueNode,
  HexagonGroupNode,
  HexagonNode,
  HexagonNodeType,
  HexagonSessionNode,
  HexagonTopicNode,
} from './WorkspaceGrid.types';
import { SingleHexagon } from './SingleHexagon';
import { getColorScoreBrand, getHexagonSVGFill } from './WorkspaceGrid.helpers';

interface TooltipBodyProps {
  node: HexagonNode;
}

export const TooltipDialogueBody = ({ node }: { node: HexagonDialogueNode }) => {
  const { formatScore } = useFormatter();
  const { t } = useTranslation();

  return (
    <LS.TooltipContainer>
      <LS.TooltipHeader>
        <UI.Flex justifyContent="space-between" alignItems="flex-end">
          <UI.Div>
            <UI.Helper>
              {t('team')}
            </UI.Helper>
            <UI.Span>
              {node.label}
            </UI.Span>
          </UI.Div>

          <UI.Div>
            <UI.Flex>
              <SingleHexagon fill={getHexagonSVGFill(node.score)} />
              <UI.Span ml={1} color={getColorScoreBrand(node.score)}>
                {formatScore(node.score)}
              </UI.Span>
            </UI.Flex>
          </UI.Div>
        </UI.Flex>
      </LS.TooltipHeader>

      <LS.TooltipBody>
        <UI.Div>
          <UI.Flex alignItems="center" justifyContent="space-between">
            <UI.Div
              mr={2}
              py={1}
              borderRadius={5}
              color="gray.700"
            >
              Responses
            </UI.Div>

            <UI.Span fontWeight={600} color="gray.400">
              <UI.Span color="gray.500">
                {node.dialogue.dialogueStatisticsSummary?.nrVotes}
              </UI.Span>
              {' responses'}
            </UI.Span>
          </UI.Flex>
        </UI.Div>
      </LS.TooltipBody>
    </LS.TooltipContainer>
  );
};

export const TooltipTopicBody = ({ node }: { node: HexagonTopicNode }) => {
  const { formatScore } = useFormatter();
  const { t } = useTranslation();

  return (
    <LS.TooltipContainer>
      <LS.TooltipHeader>
        <UI.Flex justifyContent="space-between" alignItems="flex-end">
          <UI.Div>
            <UI.Helper>
              {t('topic')}
            </UI.Helper>
            <UI.Span>
              {node.topic.name}
            </UI.Span>
          </UI.Div>

          <UI.Div>
            <UI.Flex>
              <SingleHexagon fill={getHexagonSVGFill(node.score)} />
              <UI.Span ml={1} color={getColorScoreBrand(node.score)}>
                {formatScore(node.score)}
              </UI.Span>
            </UI.Flex>
          </UI.Div>
        </UI.Flex>
      </LS.TooltipHeader>

      <LS.TooltipBody>
        <UI.Div>
          <UI.Flex alignItems="center" justifyContent="space-between">
            <UI.Div
              mr={2}
              py={1}
              borderRadius={5}
              color="gray.700"
            >
              Responses
            </UI.Div>

            <UI.Span fontWeight={600} color="gray.400">
              <UI.Span color="gray.500">
                {node.topic.nrVotes}
              </UI.Span>
              {' responses'}
            </UI.Span>
          </UI.Flex>
        </UI.Div>
      </LS.TooltipBody>
    </LS.TooltipContainer>
  );
};

export const TooltipGroupNodeBody = ({ node }: { node: HexagonGroupNode }) => {
  const { t } = useTranslation();
  const { formatScore } = useFormatter();

  return (
    <LS.TooltipContainer>
      <LS.TooltipHeader>
        <UI.Flex justifyContent="space-between" alignItems="flex-end">
          <UI.Div>
            <UI.Helper>
              {t('group')}
            </UI.Helper>
            <UI.Span>
              {node.label}
            </UI.Span>
          </UI.Div>

          <UI.Div>
            <UI.Flex>
              <SingleHexagon fill={getHexagonSVGFill(node.score)} />
              <UI.Span ml={1} color={getColorScoreBrand(node.score)}>
                {formatScore(node.score)}
              </UI.Span>
            </UI.Flex>
          </UI.Div>
        </UI.Flex>
      </LS.TooltipHeader>

      <LS.TooltipBody>
        <UI.Div>
          <UI.Flex alignItems="center" justifyContent="space-between">
            <UI.Div
              mr={2}
              py={1}
              borderRadius={5}
              color="gray.700"
            >
              Teams
            </UI.Div>

            <UI.Span fontWeight={600} color="gray.400">
              <UI.Span color="gray.500">
                {node.subGroups.length}
              </UI.Span>
              {' teams'}
            </UI.Span>
          </UI.Flex>
        </UI.Div>
      </LS.TooltipBody>
    </LS.TooltipContainer>
  );
};

export const TooltipSessionBody = ({ node }: { node: HexagonSessionNode }) => {
  const { formatScore } = useFormatter();
  const { t } = useTranslation();

  const date = format(new Date(node.session.createdAt), 'dd/MM/yyyy HH:mm:ss');

  return (
    <LS.TooltipContainer>
      <LS.TooltipHeader>
        <UI.Flex justifyContent="space-between" alignItems="flex-end">
          <UI.Div>
            <UI.Helper>
              {t('session')}
            </UI.Helper>
            <UI.Span>
              {date}
            </UI.Span>
          </UI.Div>

          <UI.Div>
            <UI.Flex>
              <SingleHexagon fill={getHexagonSVGFill(node.score)} />
              <UI.Span ml={1} color={getColorScoreBrand(node.score)}>
                {formatScore(node.score)}
              </UI.Span>
            </UI.Flex>
          </UI.Div>
        </UI.Flex>
      </LS.TooltipHeader>

      <LS.TooltipBody>
        <UI.Div>
          <UI.Flex alignItems="center" justifyContent="space-between">
            <UI.Div
              mr={2}
              px={1}
              py={1}
              borderRadius={5}
              color="gray.700"
            >
              Time spent
            </UI.Div>

            <UI.Span fontWeight={600} color="gray.400">
              <UI.Span color="gray.500">
                {node.session.totalTimeInSec}
              </UI.Span>
              {' seconds'}
            </UI.Span>
          </UI.Flex>
        </UI.Div>
      </LS.TooltipBody>
    </LS.TooltipContainer>
  );
};

export const TooltipBody = ({ node }: TooltipBodyProps) => {
  switch (node.type) {
    case HexagonNodeType.Group:
      return <TooltipGroupNodeBody node={node} />;
    case HexagonNodeType.Dialogue:
      return <TooltipDialogueBody node={node} />;
    case HexagonNodeType.Topic:
      return <TooltipTopicBody node={node} />;
    case HexagonNodeType.Session:
      return <TooltipSessionBody node={node} />;
    default: {
      return <div>Node</div>;
    }
  }
};

