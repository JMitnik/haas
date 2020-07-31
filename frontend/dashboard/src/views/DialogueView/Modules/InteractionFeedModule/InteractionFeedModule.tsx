import React, { Dispatch, SetStateAction } from 'react';

import { Card, CardBody, Div, Flex, H3, H4, Span } from '@haas/ui';

import { Info } from 'react-feather';
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
  // TODO: Set setActiveSession on a context, so you dont pass it as prop around
  const viewTimeLine = () => {};

  return (
    <Card bg="white" noHover>
      <CardBody useFlex height="100%" flexDirection="column">

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
          <Flex flexGrow={1} justifyContent="center" alignItems="center">
            <Div color="default.darker" marginRight="5px">
              <Info />
            </Div>
            <H4 color="default.darker">No data available</H4>
          </Flex>
        )}
      </CardBody>
    </Card>
  );
};

export default InteractionFeedModule;
