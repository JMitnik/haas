/* eslint-disable max-len */
import React, { Dispatch, SetStateAction } from 'react';
import { H2, Muted, Div, Hr } from '@haas/ui';
import TimelineEntry from './TimelineEntry/TimelineEntry';
import { TimelineFeedView } from './TimelineFeedOverviewStyles';

interface TimelineEntryProps {
  sessionId: string;
  value: number;
  createdAt: string;
}

const TimelineFeedOverview = ({ onActiveSessionChange, timelineEntries }: { onActiveSessionChange: Dispatch<SetStateAction<string>>, timelineEntries: Array<TimelineEntryProps> }) => (
  <TimelineFeedView>
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
      <TimelineEntry onActiveSessionChange={onActiveSessionChange} key={index} timeLineEntry={timelineEntry} />)
        )}
    {(timelineEntries?.length === 0 || (!timelineEntries)) && (
    <Div style={{ margin: '5px 20px' }}>No data available...</Div>
    )}
  </TimelineFeedView>
);

export default TimelineFeedOverview;
