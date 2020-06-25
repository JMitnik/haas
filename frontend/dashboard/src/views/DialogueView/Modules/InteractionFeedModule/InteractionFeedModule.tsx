import { useHistory, useParams } from 'react-router-dom';
import React, { Dispatch, SetStateAction } from 'react';

import { Card, CardBody, Div, H2, H3, Flex, Span } from '@haas/ui';

import { InteractionFeedEntriesContainer } from './InteractionFeedModuleStyles';
import InteractionFeedEntry from './InteractionFeedEntry';

interface TimelineEntryProps {
  id: string;
  score: number;
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
    // history.push(`/dashboard/c/${customerId}/t/${topicId}`, { modal: true });
    // onActiveSessionChange(timelineEntry.sessionId);
  };

  return (
    <Card bg="white" noHover>
      <CardBody useFlex height="100%" justifyContent="space-between" flexDirection="column">

        <H3 color="app.onWhite">
          <Flex justifyContent="space-between" alignItems="center">
            <Span>Latest interactions</Span>
          </Flex>
        </H3>
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
      </CardBody>
    </Card>
  );
};

export default InteractionFeedModule;
