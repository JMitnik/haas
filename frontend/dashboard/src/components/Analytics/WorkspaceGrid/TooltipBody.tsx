import * as UI from '@haas/ui';
import { Clock, MessageCircle } from 'react-feather';
import { useFormatter } from 'hooks/useFormatter';
import { useTranslation } from 'react-i18next';
import React from 'react';

import { ScoreBox } from 'components/ScoreBox';

import * as LS from './WorkspaceGrid.styles';
import { DateFormat, useDate } from 'hooks/useDate';
import {
  HexagonDialogueNode,
  HexagonGroupNode,
  HexagonNode,
  HexagonNodeType,
  HexagonSessionNode,
  HexagonTopicNode,
} from './WorkspaceGrid.types';
import { SingleHexagon } from './SingleHexagon';
import { getColorScoreBrandVariable, getHexagonSVGFill } from './WorkspaceGrid.helpers';

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
              <UI.Span ml={1} color={getColorScoreBrandVariable(node.score)}>
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
  const { formatScore } = useFormatter();
  const { format } = useDate();
  const { t } = useTranslation();

  const date = format(new Date(node.session.createdAt), DateFormat.HumanDateTime);

  return (
  // <LS.TooltipContainer>
  //   <LS.TooltipHeader>
  //     <UI.Flex justifyContent="space-between" alignItems="flex-end">
  //       <UI.Div>
  //         <UI.Helper>
  //           {t('session')}
  //         </UI.Helper>
  //         <UI.Span>
  //           {date}
  //         </UI.Span>
  //       </UI.Div>

  //       <UI.Div>
  //         <UI.Flex>
  //           <SingleHexagon fill={getHexagonSVGFill(node.score)} />
  //           <UI.Span ml={1} color={getColorScoreBrandVariable(node.score)}>
  //             {formatScore(node.score)}
  //           </UI.Span>
  //         </UI.Flex>
  //       </UI.Div>
  //     </UI.Flex>
  //   </LS.TooltipHeader>

  //   <LS.TooltipBody>
  //     <UI.Div>
  //       <UI.Flex alignItems="center" justifyContent="space-between">
  //         <UI.Div
  //           mr={2}
  //           px={1}
  //           py={1}
  //           borderRadius={5}
  //           color="gray.700"
  //         >
  //           Time spent
  //         </UI.Div>

  //         <UI.Span fontWeight={600} color="gray.400">
  //           <UI.Span color="gray.500">
  //             {node.session.totalTimeInSec}
  //           </UI.Span>
  //           {' seconds'}
  //         </UI.Span>
  //       </UI.Flex>
  //     </UI.Div>
  //   </LS.TooltipBody>
  // </LS.TooltipContainer>

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
    case HexagonNodeType.Topic:
      return <TooltipTopicBody node={node} />;
    case HexagonNodeType.Session:
      return <TooltipSessionBody node={node} />;
    default: {
      return <div>Node</div>;
    }
  }
};

