import * as UI from '@haas/ui';
import { Clock, MessageCircle } from 'react-feather';
import { useTranslation } from 'react-i18next';
import React from 'react';

import { DateFormat, useDate } from 'hooks/useDate';
import { ScoreBox } from 'components/ScoreBox';

import * as LS from './WorkspaceGrid.styles';
import {
  HexagonDialogueNode,
  HexagonGroupNode,
  HexagonNode,
  HexagonNodeType,
  HexagonSessionNode,
} from './WorkspaceGrid.types';

interface TooltipBodyProps {
  node: HexagonNode;
}

export const TooltipDialogueBody = ({ node }: { node: HexagonDialogueNode }) => (
  <LS.TooltipContainer>
    <LS.TooltipBody>
      <UI.Div>
        <UI.Flex>
          <ScoreBox score={node.score} />

          <UI.Div ml={2}>
            <UI.Div>
              <UI.Span fontSize="0.9rem" fontWeight="700" color="off.500">
                {node.label}
              </UI.Span>
            </UI.Div>
            <UI.Div>
              <UI.Span color="gray.400">
                <UI.Flex alignItems="center">

                  <UI.Icon width="16px">
                    <MessageCircle />
                  </UI.Icon>
                  <UI.Span ml={1}>
                    {node.dialogue.dialogueStatisticsSummary?.nrVotes}
                  </UI.Span>
                </UI.Flex>
              </UI.Span>
            </UI.Div>
          </UI.Div>
        </UI.Flex>
      </UI.Div>
    </LS.TooltipBody>
  </LS.TooltipContainer>
);

export const TooltipGroupNodeBody = ({ node }: { node: HexagonGroupNode }) => (
  <LS.TooltipContainer>
    <LS.TooltipBody>
      <UI.Div>
        <UI.Flex>
          <ScoreBox score={node.statistics?.score} />

          <UI.Div ml={2}>
            <UI.Div>
              <UI.Span fontSize="0.9rem" fontWeight="700" color="off.500">
                {node.label}
              </UI.Span>
            </UI.Div>
            <UI.Div>
              <UI.Span color="gray.400">
                <UI.Flex alignItems="center">

                  <UI.Icon width="16px">
                    <MessageCircle />
                  </UI.Icon>
                  <UI.Span ml={1}>
                    {node.statistics?.voteCount}
                  </UI.Span>
                </UI.Flex>
              </UI.Span>
            </UI.Div>
          </UI.Div>
        </UI.Flex>
      </UI.Div>
    </LS.TooltipBody>
  </LS.TooltipContainer>
);

export const TooltipSessionBody = ({ node }: { node: HexagonSessionNode }) => {
  const { format } = useDate();
  const { t } = useTranslation();

  const date = format(new Date(node.session.createdAt), DateFormat.HumanDateTime);

  return (
    <LS.TooltipContainer>
      <LS.TooltipBody>
        <UI.Div>
          <UI.Flex>
            <ScoreBox score={node.score} />

            <UI.Div ml={2}>
              <UI.Div>
                <UI.Span fontSize="0.9rem" fontWeight="700" color="off.500">
                  {date}
                </UI.Span>
              </UI.Div>
              <UI.Div>
                <UI.Span color="gray.400">
                  <UI.Flex alignItems="center">

                    <UI.Icon width="16px">
                      <Clock />
                    </UI.Icon>
                    <UI.Span ml={1}>
                      {' '}
                      {node.session.totalTimeInSec}
                      {' '}
                      {t('seconds')}
                    </UI.Span>
                  </UI.Flex>
                </UI.Span>
              </UI.Div>
            </UI.Div>
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
    case HexagonNodeType.Session:
      return <TooltipSessionBody node={node} />;
    default: {
      return <div>Node</div>;
    }
  }
};

