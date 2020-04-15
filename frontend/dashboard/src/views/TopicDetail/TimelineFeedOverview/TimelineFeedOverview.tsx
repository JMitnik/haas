import React, { Dispatch, SetStateAction } from 'react';
import { H2, Muted, Div, Hr } from '@haas/ui';
import { useParams, useHistory } from 'react-router-dom';
import TimelineEntry from './TimelineEntry/TimelineEntry';
import { TimelineFeedOverviewContainer } from './TimelineFeedOverviewStyles';

interface TimelineEntryProps {
  sessionId: string;
  value: number;
  createdAt: string;
}

const TimelineFeedOverview = ({
  onActiveSessionChange, timelineEntries,
} : {
  onActiveSessionChange: Dispatch<SetStateAction<string>>,
  timelineEntries: Array<TimelineEntryProps>
}) => {
  const history = useHistory();
  const { customerId, topicId } = useParams();

  // TODO: Set setActiveSession on a context, so you dont pass it as prop around
  const viewTimeLine = (timelineEntry: any) => {
    history.push(`/c/${customerId}/t/${topicId}/e/${timelineEntry.sessionId}`);
    onActiveSessionChange(timelineEntry.sessionId);
  };

  return (
    <TimelineFeedOverviewContainer>
      <Div useFlex alignItems="center" mb={4}>
        <H2 color="primary" fontWeight={400}>
          Timeline feed
        </H2>
      </Div>
      <Muted>
        History of entries for this topic
      </Muted>
      <Hr />
      {timelineEntries?.length > 0 && timelineEntries?.map((timelineEntry, index) => (
        <TimelineEntry
          viewTimeLine={viewTimeLine}
          onActiveSessionChange={onActiveSessionChange}
          key={index}
          timeLineEntry={timelineEntry}
        />
      )
      )}
      {(timelineEntries?.length === 0 || (!timelineEntries)) && (
        <Div style={{ margin: '5px 20px' }}>No data available...</Div>
      )}
    </TimelineFeedOverviewContainer>
  );
};

export default TimelineFeedOverview;
