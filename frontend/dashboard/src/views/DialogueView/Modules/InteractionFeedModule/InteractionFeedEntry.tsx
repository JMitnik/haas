import { format } from 'date-fns';
import React, { Dispatch, SetStateAction } from 'react';

import { Div, H5 } from '@haas/ui';

import { Tag } from '@chakra-ui/core';
import { InteractionFeedEntryContainer, InteractionFeedEntryValueContainer } from './InteractionFeedEntryStyles';

interface TimelineEntryProps {
  id: string;
  score: number;
  createdAt: string;
}

const InteractionFeedEntry = ({
  timeLineEntry,
  viewTimeLine,
}: {
  onActiveSessionChange: Dispatch<SetStateAction<string>>,
  timeLineEntry: TimelineEntryProps,
  viewTimeLine: Function
}) => {
  const date = new Date(parseInt(timeLineEntry.createdAt, 10));
  const acceptedDate = format(date, 'dd-LLL-yyyy HH:mm:ss');

  return (
    <InteractionFeedEntryContainer onClick={() => viewTimeLine(timeLineEntry)}>
      <InteractionFeedEntryValueContainer value={timeLineEntry.score}>
        {Number(timeLineEntry.score / 10).toFixed(1)}
      </InteractionFeedEntryValueContainer>

      <Div>
        <Tag size="sm" fontSize="0.5rem">
          {timeLineEntry.id}
        </Tag>
        {' '}
        has voted
      </Div>

      <Div useFlex justifyContent="flex-end" gridColumn="2">
        <H5 color="app.mutedAltOnWhite">
          {acceptedDate}
        </H5>
      </Div>
    </InteractionFeedEntryContainer>
  );
};

export default InteractionFeedEntry;
