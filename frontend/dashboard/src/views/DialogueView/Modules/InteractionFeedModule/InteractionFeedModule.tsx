import { useHistory, useParams } from 'react-router-dom';
import React, { Dispatch, SetStateAction } from 'react';

import { Div, H2 } from '@haas/ui';

import { InteractionFeedEntriesContainer, InteractionFeedModuleContainer } from './InteractionFeedModuleStyles';
import InteractionFeedEntry from './InteractionFeedEntry';

interface TimelineEntryProps {
  sessionId: string;
  value: number;
  createdAt: string;
}

const InteractionFeedModule = ({
  onActiveSessionChange,
  timelineEntries,
} : {
  onActiveSessionChange: Dispatch<SetStateAction<string>>,
  timelineEntries: Array<TimelineEntryProps>
}) => {
  const history = useHistory();
  const { customerId, topicId } = useParams();

  // TODO: Set setActiveSession on a context, so you dont pass it as prop around
  const viewTimeLine = (timelineEntry: any) => {
    history.push(`/dashboard/c/${customerId}/t/${topicId}`, { modal: true });
    onActiveSessionChange(timelineEntry.sessionId);
  };

  return (
    <InteractionFeedModuleContainer>
      <H2 color="primary" fontWeight={400}>
        Interfaction feed
      </H2>

      <InteractionFeedEntriesContainer>
        {timelineEntries?.length > 0 && timelineEntries?.map((timelineEntry, index) => (
          <InteractionFeedEntry
            viewTimeLine={viewTimeLine}
            onActiveSessionChange={onActiveSessionChange}
            key={index}
            timeLineEntry={timelineEntry}
          />
        ))}
      </InteractionFeedEntriesContainer>

      {(timelineEntries?.length === 0 || (!timelineEntries)) && (
        <Div style={{ margin: '5px 20px' }}>No data available...</Div>
      )}
    </InteractionFeedModuleContainer>
  );
};

export default InteractionFeedModule;
