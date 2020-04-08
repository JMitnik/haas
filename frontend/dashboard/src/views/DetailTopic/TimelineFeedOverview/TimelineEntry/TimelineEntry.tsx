import React, { Dispatch, SetStateAction } from 'react';
import { Div, H5 } from '@haas/ui';
import { useParams, useHistory } from 'react-router-dom';
import { TimelineEntryView } from './TImelineEntryStyles';

interface TimelineEntryProps {
  sessionId: string;
  value: number;
  createdAt: string;
}

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
  onActiveSessionChange,
  timeLineEntry,
}: {
  onActiveSessionChange: Dispatch<SetStateAction<string>>,
  timeLineEntry: TimelineEntryProps
}) => {
  const date = new Date(timeLineEntry.createdAt);
  const acceptedDate = getUniversalDate(date);
  const history = useHistory();
  const { customerId, topicId } = useParams();

  // TODO: Set setActiveSession on a context, so you dont pass it as prop around
  const viewTimeLine = () => {
    history.push(`/c/${customerId}/t/${topicId}/e/${timeLineEntry.sessionId}`);
    onActiveSessionChange(timeLineEntry.sessionId);
  };

  return (
    <TimelineEntryView onClick={() => viewTimeLine()}>
      <Div>
        <Div>
          User
          {' '}
          {timeLineEntry.sessionId}
          {' '}
          has voted
          {' '}
          {timeLineEntry.value}
        </Div>
      </Div>

      <Div>
        <H5>
          {acceptedDate}
        </H5>
      </Div>
    </TimelineEntryView>
  );
};

export default TimelineEntry;
