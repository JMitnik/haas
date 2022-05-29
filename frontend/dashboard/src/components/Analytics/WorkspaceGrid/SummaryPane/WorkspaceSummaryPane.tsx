import * as UI from '@haas/ui';
import { DateFormat, useDate } from 'hooks/useDate';
import { useCustomer } from 'providers/CustomerProvider';
import React from 'react';

import { DialogueImpactScoreType, useGetWorkspaceSummaryDetailsQuery } from 'types/generated-types';

import { HealthCard } from 'components/Analytics/Common/HealthCard/HealthCard';
import { TopicRankingWidget } from 'components/Analytics/Topic/TopicRankingWidget/TopicRankingWidget';
import { UrgentTopicWidget } from 'components/Analytics/Topic/UrgentTopicWidget';

import { SummaryPaneProps } from './WorkspaceSummaryPane.types';

export const WorkspaceSummaryPane = ({ onDialogueChange, startDate, endDate }: SummaryPaneProps) => {
  const { activeCustomer } = useCustomer();
  const { format } = useDate();

  const { data } = useGetWorkspaceSummaryDetailsQuery({
    variables: {
      id: activeCustomer?.id,
      healthInput: {
        startDateTime: format(startDate, DateFormat.DayFormat),
        endDateTime: format(endDate, DateFormat.DayFormat),
      },
      summaryInput: {
        impactType: DialogueImpactScoreType.Average,
        startDateTime: format(startDate, DateFormat.DayFormat),
        endDateTime: format(endDate, DateFormat.DayFormat),
        refresh: true,
      },
    },
  });

  const summary = data?.customer?.statistics;

  // Various stats fields
  const health = summary?.health;
  const urgentPath = summary?.urgentPath;
  const rankedTopics = summary?.rankedTopics || [];

  const responseCount = summary?.basicStats?.responseCount || 0;

  return (
    <UI.Div>
      <UI.Div mb={4}>
        <UI.Helper fontSize="1.1rem" textAlign="center" mb={4} color="off.500">
          Trends in
          {' '}
          {activeCustomer?.name}
        </UI.Helper>
      </UI.Div>
      <UI.Flex justifyContent="center">
        {health && (
          <UI.Div minWidth={250}>
            <HealthCard
              score={health.score}
              responseCount={health.nrVotes}
              negativeResponseCount={health.negativeResponseCount}
              positiveResponseCount={health.nrVotes - health.negativeResponseCount}
            />
          </UI.Div>
        )}

        {urgentPath && (
          <UI.Div width={300} height={250} ml={4}>
            <UrgentTopicWidget
              topic={urgentPath.path.topicStrings[0]}
              dialogueLabel="Team"
              responseCount={urgentPath.basicStats.responseCount}
              onClick={() => onDialogueChange(urgentPath.dialogue?.id || '', '')}
              dialogueTitle={urgentPath.dialogue?.title || ''}
            />
          </UI.Div>
        )}

        {rankedTopics.length > 0 && (
          <UI.Div width={400} height={250} ml={4}>
            <TopicRankingWidget
              topics={rankedTopics}
              totalResponseCount={responseCount}
            />
          </UI.Div>
        )}
      </UI.Flex>
    </UI.Div>
  );
};
