import React, { Dispatch, SetStateAction } from 'react';
import { Div, H5 } from '@haas/ui';
import { TimelineEntryContainer } from './TimelineEntryStyles';
import styled, { css } from 'styled-components/macro';

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

const TimeLineEntryValueContainer = styled.div`
  ${({ value }: { value: number }) => css`
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px;
    font-weight: 1000;
    font-size: 1.5rem;

    ${value < 50 && css`
      background: #FED7D7;
      color: #E53E3E;
    `}

    ${value >= 50 && value < 75 && css`
      background: #FEEBC8;
      color: #C05621;
    `}

    ${value >= 75 && value < 95 && css`
      background: #C6F6D5;
      color: #2F855A;
    `}

    ${value >= 95 && css`
      background: #BEE3F8;
      color: #2B6CB0;
    `}
  `}
`;


const TimelineEntry = ({
  timeLineEntry,
  viewTimeLine,
}: {
  onActiveSessionChange: Dispatch<SetStateAction<string>>,
  timeLineEntry: TimelineEntryProps,
  viewTimeLine: Function
}) => {
  const date = new Date(parseInt(timeLineEntry.createdAt));
  const acceptedDate = getUniversalDate(date);

  return (
    <TimelineEntryContainer onClick={() => viewTimeLine(timeLineEntry)}>
      <TimeLineEntryValueContainer value={timeLineEntry.value}>
        {Number(timeLineEntry.value / 10).toFixed(1)}
      </TimeLineEntryValueContainer>
      <Div>
        {`User ${timeLineEntry.sessionId} has voted `}
      </Div>
      {/* <Div>
        <H5>
          {acceptedDate}
        </H5>
      </Div> */}
    </TimelineEntryContainer>
  );
};

export default TimelineEntry;
