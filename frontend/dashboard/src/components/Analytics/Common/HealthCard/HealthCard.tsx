import * as UI from '@haas/ui';
import React from 'react';

import { useFormatter } from 'hooks/useFormatter';

import { MessageCircle } from 'react-feather';
import { ProgressCircle } from '../../WorkspaceGrid/SummaryPane/ProgressCircle';
import { getColorScoreBrandVariable, getHexagonSVGFill } from '../../WorkspaceGrid/WorkspaceGrid.helpers';

interface HealthCardProps {
  score: number;
  responseCount: number;
  negativeResponseCount: number;
  positiveResponseCount: number;
  isPreview?: boolean;
}

export const HealthCard = ({
  score,
  responseCount,
  positiveResponseCount,
  negativeResponseCount,
  isPreview
}: HealthCardProps) => {
  const { formatFractionToPercentage } = useFormatter();
  return (
    <UI.NewCard boxShadow="md" hasBlur maxWidth={250}>
      <UI.CardBodyLarge>
        <UI.Flex justifyContent="center">
          <ProgressCircle
            percentage={score}
            stroke={getHexagonSVGFill(score)}
            backgroundStroke="rgba(0, 0, 0, 0.1)"
            size={100}
            radius={45}
            strokeWidth={10}
          >
            <UI.Text fontSize="1.5rem" fontWeight={700} color={getColorScoreBrandVariable(score, true)}>
              {formatFractionToPercentage(score / 100)}
            </UI.Text>
          </ProgressCircle>
        </UI.Flex>

        <UI.Div mt={2}>
          <UI.Helper
            mt={2}
            textAlign="center"
            color="gray.500"
            fontWeight={500}
            fontSize="1.3rem"
          >
            Happiness score
          </UI.Helper>
        </UI.Div>

        {/* <UI.Div mt={1} width="100%" style={{ textAlign: 'center' }}>
          <UI.Flex justifyContent="center" alignItems="center">
            <UI.Icon color="off.600">
              <MessageCircle width={21} />
            </UI.Icon>
            <UI.Span ml={1} fontWeight={700} fontSize="1.2rem" color="off.700">
              {responseCount}
            </UI.Span>
          </UI.Flex>
        </UI.Div> */}

        {!isPreview && (
          <UI.Div>
            <UI.Flex mt={2} justifyContent="space-between">
              <UI.Span color="green.500" fontWeight={600}>
                Happy people
              </UI.Span>
              <UI.Span color="off.500">
                {positiveResponseCount}
              </UI.Span>
            </UI.Flex>

            <UI.Flex mt={1} justifyContent="space-between">
              <UI.Span color="red.500" fontWeight={600}>
                Sad people
              </UI.Span>
              <UI.Span color="off.500">
                {negativeResponseCount}
              </UI.Span>
            </UI.Flex>
          </UI.Div>
        )}
      </UI.CardBodyLarge>
    </UI.NewCard>
  );
};
