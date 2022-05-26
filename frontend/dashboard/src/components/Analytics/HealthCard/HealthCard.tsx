import * as UI from '@haas/ui';
import React from 'react';

import { useFormatter } from 'hooks/useFormatter';

import { ProgressCircle } from '../WorkspaceGrid/SummaryPane/ProgressCircle';
import { getColorScoreBrand, getHexagonSVGFill } from '../WorkspaceGrid/WorkspaceGrid.helpers';

interface HealthCardProps {
  score: number;
  responseCount: number;
}

export const HealthCard = ({ score, responseCount }: HealthCardProps) => {
  const { formatFractionToPercentage } = useFormatter();
  return (
    <UI.NewCard boxShadow="md">
      <UI.CardBodyLarge>
        <UI.Flex alignItems="center" flexWrap="wrap">
          <UI.Div>
            <ProgressCircle
              percentage={score}
              stroke={getHexagonSVGFill(score)}
              backgroundStroke="rgba(0, 0, 0, 0.1)"
              size={150}
              radius={45}
              strokeWidth={10}
            >
              <UI.Text fontSize="1.7rem" fontWeight={700} color={getColorScoreBrand(score, true)}>
                {formatFractionToPercentage(score / 100)}
              </UI.Text>
            </ProgressCircle>
          </UI.Div>

          <UI.Div ml={72} maxWidth={400}>
            <UI.H3 fontWeight={700} color="green.500">Your people are feeling healthy!</UI.H3>
            <UI.Span color="off.400" fontWeight={500} fontSize="1rem">
              Good job, this week, due to a total of
              {' '}
              <UI.Strong>
                {responseCount}
              </UI.Strong>
              {' '}
              responses, you are doing much better.
            </UI.Span>
          </UI.Div>
        </UI.Flex>
      </UI.CardBodyLarge>
    </UI.NewCard>
  );
};
