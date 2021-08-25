import * as UI from '@haas/ui';
import { Tooltip } from '@chakra-ui/core';
import { useTranslation } from 'react-i18next';
import React from 'react';
import styled, { css } from 'styled-components';

import { DialoguePathsSummaryType, QuestionNode } from 'types/generated-types';
import { NodeTypeIcon } from '../InteractionFeedModule/InteractionFeedEntry';

interface PathSummaryModuleProps {
  data?: DialoguePathsSummaryType | null;
}

export const EntryBreadCrumbContainer = styled(UI.Div) <{ score?: number | null, isInline?: boolean | null }>`
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

export const CompactEntriesPath = ({ nodes }: { nodes: QuestionNode[] }) => {
  const { t } = useTranslation();
  return (
    <UI.Flex>
      {nodes.map((node, index) => (
        <Tooltip
          zIndex={400}
          key={index}
          hasArrow
          aria-label={node.title}
          placement="top"
          label={node.title}
        >
          <EntryBreadCrumbContainer
            isInline
            pr={3}
            zIndex={10 - index}
            score={null}
          >
            <NodeTypeIcon node={node} />
          </EntryBreadCrumbContainer>
        </Tooltip>
      ))}
    </UI.Flex>
  );
};

export const PathSummaryModule = ({ data }: PathSummaryModuleProps) => {
  console.log(data);
  return (
    <UI.Card bg="white">
      <UI.CardHead bg="red.50">
        <UI.Text color="red.500">
          Path summary
        </UI.Text>
      </UI.CardHead>
      <UI.CardBody>
        <UI.Grid gridTemplateColumns="1fr 1fr">
          <UI.Flex alignItems="center" justifyContent="center">
            {data?.mostPopularPath?.nodes.length && (
              <CompactEntriesPath
                nodes={data?.mostPopularPath?.nodes}
              />
            )}
          </UI.Flex>
          <UI.Flex alignItems="center" justifyContent="center">
            {data?.mostCriticalPath?.nodes.length && (
              <CompactEntriesPath
                nodes={data?.mostCriticalPath?.nodes}
              />
            )}
          </UI.Flex>
        </UI.Grid>
      </UI.CardBody>
    </UI.Card>
  );
};

