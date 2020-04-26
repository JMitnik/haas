import React, { Dispatch, SetStateAction } from 'react';
import { Div, H5 } from '@haas/ui';
import { TimelineEntryContainer } from './TimelineEntryStyles';

interface TimelineEntryProps {
  sessionId: string;
  value: number;
  createdAt: string;
}

// TODO: Replace with date parser
const monthMap = new Map([
  [0, 'JAN'],
  [1, 'FEB'],
  [2, 'MAR'],
  [3, 'APR'],
  [4, 'MAY'],
  [5, 'JUN'],
  [6, 'JUL'],
  [7, 'AUG'],
  [8, 'SEP'],
  [9, 'OCT'],
  [10, 'NOV'],
  [11, 'DEC'],
]);

const getUniversalDate = (date: Date) => {
  const result = `${date.getDate().toString()}-${monthMap.get(date.getMonth())}-${date.getFullYear().toString()}`;
  return result;
};

const TimelineEntry = ({
  timeLineEntry,
  viewTimeLine,
}: {
  onActiveSessionChange: Dispatch<SetStateAction<string>>,
  timeLineEntry: TimelineEntryProps,
  viewTimeLine: Function
}) => {
  const date = new Date(timeLineEntry.createdAt);
  const acceptedDate = getUniversalDate(date);

  return (
    <TimelineEntryContainer onClick={() => viewTimeLine(timeLineEntry)}>
      <Div>
        {`User ${timeLineEntry.sessionId} has voted ${timeLineEntry.value}`}
      </Div>
      <Div>
        <H5>
          {acceptedDate}
        </H5>
      </Div>
    </TimelineEntryContainer>
  );
};

export default TimelineEntry;
