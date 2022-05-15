import * as UI from '@haas/ui';
import { DateFormat, useDate } from 'hooks/useDate';
import { useCustomer } from 'providers/CustomerProvider';
import { useFormatter } from 'hooks/useFormatter';
import React from 'react';

import { DialogueImpactScoreType, useGetWorkspaceSummaryDetailsQuery } from 'types/generated-types';

import { ArrowRightCircle } from 'react-feather';
import { HexagonNodeType } from '../WorkspaceGrid.types';
import { ProgressCircle } from './ProgressCircle';
import { SummaryPaneProps } from './WorkspaceSummaryPane.types';
import { getColorScoreBrand, getHexagonSVGFill } from '../WorkspaceGrid.helpers';

export const WorkspaceSummaryPane = ({ currentState, onDialogueChange }: SummaryPaneProps) => {
  const { activeCustomer } = useCustomer();
  const { getTomorrow, getStartOfWeek, format } = useDate();
  const { formatFractionToPercentage } = useFormatter();

  const { data, loading } = useGetWorkspaceSummaryDetailsQuery({
    variables: {
      id: activeCustomer?.id,
      healthInput: {
        startDateTime: format(getStartOfWeek(), DateFormat.DayFormat),
        endDateTime: format(getTomorrow(), DateFormat.DayFormat),
      },
      summaryInput: {
        impactType: DialogueImpactScoreType.Average,
        startDateTime: format(getStartOfWeek(), DateFormat.DayFormat),
        endDateTime: format(getTomorrow(), DateFormat.DayFormat),
        refresh: true,
      },
    },
  });

  const summary = data?.customer?.statistics;

  // Various stats fields
  const health = summary?.health;
  const urgentPath = summary?.urgentPath;
  const mostChangedPath = summary?.mostChangedPath.topPositiveChanged[0];
  const trendingPath = summary?.mostTrendingTopic;

  const voteCount = currentState.childNodes.reduce((acc, node) => {
    if (node.type === HexagonNodeType.Group) {
      return acc + (node?.statistics?.voteCount ?? 0);
    }

    return acc;
  }, 0);

  return (
    <UI.Div mt={4}>
      <UI.H2 fontWeight={600} mb={4} color="off.500">Club hades</UI.H2>

      <UI.Grid gridTemplateColumns="1fr">

        {health?.score && (
          <UI.FadeIn>
            <UI.NewCard boxShadow="md">
              <UI.CardBodyLarge>
                <UI.Flex alignItems="center" flexWrap="wrap">
                  <UI.Div>
                    <ProgressCircle
                      percentage={health.score}
                      stroke={getHexagonSVGFill(health.score)}
                      backgroundStroke="rgba(0, 0, 0, 0.1)"
                      size={150}
                      radius={45}
                      strokeWidth={10}
                    >
                      <UI.Text fontSize="1.7rem" fontWeight={700} color={getColorScoreBrand(health.score, true)}>
                        {formatFractionToPercentage(health?.score / 100)}
                      </UI.Text>
                    </ProgressCircle>
                  </UI.Div>

                  <UI.Div ml={72} maxWidth={400}>
                    <UI.H3 fontWeight={700} color="green.500">Your people are feeling healthy!</UI.H3>
                    <UI.Text color="off.400" fontWeight={500} fontSize="1rem">
                      Good job, this week, due to a total of
                      {' '}
                      <UI.Strong>
                        {health?.nrVotes}
                      </UI.Strong>
                      {' '}
                      responses, you are doing much better.
                    </UI.Text>
                  </UI.Div>
                </UI.Flex>
              </UI.CardBodyLarge>
            </UI.NewCard>
          </UI.FadeIn>
        )}

        {/* {mostChangedPath && (
          <UI.NewCard boxShadow="md">
            <UI.CardBody>
              <UI.Text fontSize="1.1rem" fontWeight={500} color="off.500">
                Most changed path
              </UI.Text>
              <UI.Text fontSize="1.7rem" fontWeight={700} color="off.600">
                {mostChangedPath.topic}
              </UI.Text>
            </UI.CardBody>
          </UI.NewCard>
        )} */}

        <UI.Grid gridTemplateColumns="1fr">
          <UI.Div>
            {trendingPath && (
              <UI.FadeIn>
                <UI.NewCard boxShadow="md">
                  <UI.CardBodyLarge>
                    <UI.Flex justifyContent="space-between">
                      <UI.Helper fontSize="1.1rem" fontWeight={600} color="blue.500" mb={2}>
                        Trending topic
                      </UI.Helper>
                      <UI.Helper color="blue.200">
                        <UI.Span ml={4}>
                          in Team
                          {' '}
                          {trendingPath.group}
                        </UI.Span>
                      </UI.Helper>
                    </UI.Flex>
                    <UI.Text fontSize="1.7rem" fontWeight={700} color="blue.600" my={1} lineHeight="1">
                      {trendingPath.nrVotes}
                    </UI.Text>
                    <UI.Text fontSize="1rem" color="blue.700" mt={0}>
                      people are talking about
                      {' '}
                      {trendingPath.path}
                      {' '}

                    </UI.Text>
                  </UI.CardBodyLarge>
                </UI.NewCard>
              </UI.FadeIn>
            )}
          </UI.Div>

          {urgentPath && (
            <UI.Div>
              <UI.FadeIn>
                <UI.NewCard boxShadow="md" bg="red.500">
                  <UI.CardBodyLarge>
                    <UI.Flex justifyContent="space-between">
                      <UI.Helper fontSize="1.1rem" fontWeight={600} color="red.100" mb={2}>
                        Urgent issue
                      </UI.Helper>
                      <UI.Helper color="red.100">
                        <UI.Span ml={4}>
                          in Team
                          {' '}
                          {urgentPath.dialogue?.title}
                        </UI.Span>
                      </UI.Helper>
                    </UI.Flex>
                    <UI.Div maxWidth={500} mt={2}>
                      <UI.Text fontSize="1rem" fontWeight={500} color="white" my={1} lineHeight="1">
                        We have detected
                        {' '}
                        {urgentPath.basicStats.responseCount}
                        {' '}
                        problematic sign related to
                        {' '}
                        {' '}
                        <UI.Strong>
                          {urgentPath.path.topicStrings[0]}
                        </UI.Strong>
                        .
                      </UI.Text>
                    </UI.Div>

                    <UI.Div onClick={async () => await onDialogueChange?.(urgentPath.dialogue?.id || '')} color="red.100" mt={3} display="flex" alignItems="center">
                      <UI.Icon color="red.200" mr={2} fontSize={0.8}>
                        <ArrowRightCircle />
                      </UI.Icon>

                      <UI.Span fontSize="1rem" fontWeight={600}>
                        Take action
                      </UI.Span>
                    </UI.Div>
                  </UI.CardBodyLarge>
                </UI.NewCard>
              </UI.FadeIn>
            </UI.Div>
          )}
        </UI.Grid>

      </UI.Grid>
    </UI.Div>
  );
};
