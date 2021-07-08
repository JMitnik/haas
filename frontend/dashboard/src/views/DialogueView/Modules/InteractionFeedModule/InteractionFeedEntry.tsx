import { Clipboard, Clock, Link as LinkIcon, MessageCircle, Target } from 'react-feather';
import { Icon, Tooltip } from '@chakra-ui/core';
import { formatDistanceToNow } from 'date-fns';
import { useTranslation } from 'react-i18next';
import React from 'react';
import styled, { css } from 'styled-components';

import { Div, Flex, Span, Text } from '@haas/ui';
import {
  dialogueStatistics_customer_dialogue_sessions_nodeEntries_relatedNode as Node,
  dialogueStatistics_customer_dialogue_sessions_nodeEntries as NodeEntry,
  dialogueStatistics_customer_dialogue_sessions as Session,
} from 'views/DialogueView/__generated__/dialogueStatistics';
import Logo from 'components/Logo';
import parseNodeEntryValue from 'utils/parseNodeEntryValue';
import scoreToColors from 'utils/scoreToColors';

import { InteractionFeedEntryContainer, InteractionFeedEntryValueContainer } from './InteractionFeedEntryStyles';

export const NodeTypeIcon = ({ node }: { node: Node | null }) => {
  if (!node?.type) return <Div />;

  switch (node.type) {
    case 'SLIDER':
      return <Logo />;
    case 'CHOICE':
      return <Target />;
    case 'LINK':
      return <LinkIcon />;
    case 'REGISTRATION':
      return <Clipboard />;
    case 'TEXTBOX':
      return <MessageCircle />;
    case 'FORM':
      return <Clipboard />;
    default:
      return <Logo />;
  }
};

export const EntryBreadCrumbContainer = styled(Div)<{ score?: number | null, isInline?: boolean | null }>`
  ${({ theme, score, isInline = false }) => css`
      display: flex;
      align-items: center;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      font-weight: 500;
      height: 40px;
      padding: 0;
      border: 1px solid white;
      justify-content: center;
      border-radius: 100px !important;
      width: 40px;

      ${isInline && css`
        margin-left: -8px;
      `}

      &:first-of-type {
        border-top-left-radius: 30px;
        border-border-bottom-left-radius: 30px;
      }

      &:last-of-type {
        border-top-right-radius: 30px;
        border-bottom-right-radius: 30px;
      }

      ${score && (({ background, color }) => css`
        background: ${background};
        color: ${color};
      `)(scoreToColors(score))}

      ${!score && css`
        background: ${theme.colors.gray[100]};
        color: ${theme.colors.gray[400]};
        font-size: 900;
      `}

      svg {
        width: 24px;
        height: 24px;
      }
  `}
`;

export const CompactEntriesPath = ({ nodeEntries }: { nodeEntries: NodeEntry[] }) => {
  const { t } = useTranslation();
  return (
    <Flex>
      {nodeEntries.map((entry, index) => (
        <Tooltip
          zIndex={400}
          key={index}
          hasArrow
          aria-label={parseNodeEntryValue(entry, t)?.toString() || ''}
          placement="top"
          label={parseNodeEntryValue(entry, t)?.toString()}
        >
          <EntryBreadCrumbContainer
            isInline
            pr={3}
            zIndex={10 - index}
            score={entry.relatedNode?.type === 'SLIDER' ? entry.value?.sliderNodeEntry : null}
          >
            <NodeTypeIcon node={entry.relatedNode} />
          </EntryBreadCrumbContainer>
        </Tooltip>
      ))}
    </Flex>
  );
};

const InteractionFeedEntry = ({ interaction }: { interaction: Session }) => {
  const date = new Date(parseInt(interaction.createdAt, 10));
  const dist = formatDistanceToNow(date);
  const { t } = useTranslation();

  return (
    <InteractionFeedEntryContainer>
      <Flex flexWrap="wrap" width="100%" justifyContent="space-between">
        <Flex>
          <InteractionFeedEntryValueContainer value={interaction.score}>
            {Number(interaction.score / 10).toFixed(1)}
          </InteractionFeedEntryValueContainer>

          {interaction?.nodeEntries[1]?.value ? (
            <Div ml={2}>
              <Text color="gray.400">
                About
              </Text>
              {' '}
              <Text color="gray.500" fontWeight={800} fontSize="0.8rem">
                {parseNodeEntryValue(interaction?.nodeEntries[1], t)}
              </Text>
            </Div>
          ) : (
            <Div ml={2}>
              <Text color="gray.400">
                Voting only
              </Text>
            </Div>
          )}
        </Flex>

        <Div ml="auto">
          <CompactEntriesPath nodeEntries={interaction.nodeEntries} />
        </Div>
      </Flex>
      <Flex>
        <Text mt={2} color="gray.300" fontWeight="600" textAlign="right">
          <Icon
            as={Clock}
          />
          <Span ml={1}>
            {dist}
            {' '}
            ago
          </Span>
        </Text>
      </Flex>
    </InteractionFeedEntryContainer>
  );
};

export default InteractionFeedEntry;
