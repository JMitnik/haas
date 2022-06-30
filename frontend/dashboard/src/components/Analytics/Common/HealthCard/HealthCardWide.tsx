import * as UI from '@haas/ui';
import React from 'react';

import { useFormatter } from 'hooks/useFormatter';

import { ProgressCircle } from '../../WorkspaceGrid/SummaryPane/ProgressCircle';
import { getColorScoreBrandVariable, getHexagonSVGFill } from '../../WorkspaceGrid/WorkspaceGrid.helpers';
import { useTranslation } from 'react-i18next';
import { Heart } from 'react-feather';
import { FilterEnabledLabel } from 'components/Analytics/WorkspaceGrid/FilterEnabledLabel';

interface HealthCardProps {
  score: number;
  negativeResponseCount: number;
  positiveResponseCount: number;
  isFilterEnabled: boolean;
  onResetFilters: () => void;
  isPreview?: boolean;
}

export const HealthCardWide = ({
  score,
  positiveResponseCount,
  negativeResponseCount,
  onResetFilters,
  isFilterEnabled,
}: HealthCardProps) => {
  const { t } = useTranslation();
  const { formatFractionToPercentage, } = useFormatter();

  const totalCount = positiveResponseCount + negativeResponseCount;
  const positiveRate = ((positiveResponseCount) / (totalCount + 0.1)) * 100
  const negativeRate = ((negativeResponseCount) / (totalCount + 0.1)) * 100

  return (
    <UI.Card boxShadow="md" hasBlur>
      <UI.CardHeader>
        <UI.Flex justifyContent="space-between" alignItems="center">
          <UI.H4 color="off.500" fontWeight={600} style={{ display: 'flex', alignItems: 'center' }}>
            <UI.Icon mr={2}>
              <Heart />
            </UI.Icon>
            Response health
          </UI.H4>

          {isFilterEnabled && (
            <FilterEnabledLabel
              onResetFilter={onResetFilters}
            />
          )}
        </UI.Flex>
      </UI.CardHeader>
      <UI.CardBody>
        <UI.Flex justifyContent="space-between">
          <UI.Div mr={4}>
            <ProgressCircle
              percentage={score}
              stroke={getHexagonSVGFill(score)}
              backgroundStroke="rgba(0, 0, 0, 0.1)"
              size={80}
              radius={45}
              strokeWidth={10}
            >
              <UI.Text fontSize="1.2rem" fontWeight={700} color={getColorScoreBrandVariable(score, true)}>
                {formatFractionToPercentage(score / 100)}
              </UI.Text>
            </ProgressCircle>
          </UI.Div>
          <UI.ColumnFlex justifyContent="space-around" width="100%" pr={4}>
            <UI.Div>
              <UI.Flex alignItems="center">
                <UI.Flex alignItems="center" mr={4}>
                  <UI.Span
                    display="inline-block"
                    width="10px"
                    height="10px"
                    bg="green.500"
                    mr={1}
                    style={{ borderRadius: '100%' }}
                  />
                  <UI.Span color="off.500" fontWeight={600}>
                    Happy
                  </UI.Span>
                </UI.Flex>

                <UI.Flex alignItems="center">
                  <UI.Span
                    display="inline-block"
                    width="10px"
                    height="10px"
                    bg="red.500"
                    mr={1}
                    style={{ borderRadius: '100%' }}
                  />
                  <UI.Span color="off.500" fontWeight={600}>
                    Unhappy
                  </UI.Span>
                </UI.Flex>
              </UI.Flex>
            </UI.Div>

            <UI.Flex width="60%">
              <UI.Div width={`${positiveRate}%`}>
                <UI.Div bg="green.500" borderRadius={20} mr={1} height={3} />
                <UI.Div position="absolute">
                  <UI.Span color="off.600" fontWeight={700}>
                    {positiveRate.toFixed(0)}
                    {'%  '}
                    {'('}
                    {positiveResponseCount}
                    {')'}
                  </UI.Span>
                </UI.Div>
              </UI.Div>
              <UI.Div width={`${negativeRate}%`}>
                <UI.Div bg="red.500" borderRadius={20} mr={1} height={3} />
                <UI.Div position="absolute">
                  <UI.Span color="off.600" fontWeight={700}>
                    {negativeRate.toFixed(0)}
                    {'%  '}
                    {'('}
                    {negativeResponseCount}
                    {')'}
                  </UI.Span>
                </UI.Div>
              </UI.Div>
            </UI.Flex>

            <UI.Flex width="60%">
              <UI.Div width={`${positiveRate}%`}>
              </UI.Div>
            </UI.Flex>
          </UI.ColumnFlex>
        </UI.Flex>
      </UI.CardBody>
    </UI.Card>
  );
};
