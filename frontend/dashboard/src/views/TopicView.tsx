/* eslint-disable react/jsx-one-expression-per-line */
import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { H2, Flex, Muted } from '@haas/ui';
import styled, { css } from 'styled-components';
import { useParams } from 'react-router-dom';

import getQuestionnaireData from '../queries/getQuestionnaireData';

interface timelineEntry {
  sessionId: string;
  value: number;
  createdAt: string;
}

interface QuestionnaireDetailResult {
  customerName: string;
  title: string;
  description: string;
  creationDate: string;
  updatedAt: string;
  average: string;
  totalNodeEntries: number;
  timelineEntries?: Array<timelineEntry>
}

const TopicView = () => {
  const { topicId } = useParams();

  const { loading, error, data } = useQuery(getQuestionnaireData, {
    variables: { topicId },
  });

  if (loading) {
    return (<div> loading... </div>);
  }

  const resultData = data?.getQuestionnaireData;

  return (
    <>
      <Flex height="100%" alignItems="center" justifyContent="space-between">
        <TopicDetails QuestionnaireDetailResult={resultData} />
        <HistoryLog timelineEntries={resultData?.timelineEntries} />
      </Flex>
    </>
  );
};



const HistoryLog = ({ timelineEntries } : { timelineEntries : Array<timelineEntry> }) => {
  return (
    <HistoryLogView>
      <H2 color="default.text" fontWeight={400} mb={4}>
        Timeline
      </H2>
      <Muted>
        History of entries for this topic
      </Muted>
      <Hr />
      {
        timelineEntries.length > 0 && timelineEntries?.map(
          (timelineEntry, index) => <TimelineEntry key={index} timelineEntry={timelineEntry} />)
      }
    </HistoryLogView>
  );
};

const getUniversalDate = (date: Date) => {
  const result = `${date.getDay().toString()}-${monthMap.get(date.getMonth())}-${date.getFullYear().toString()}`;
  return result;
};

const TimelineEntry = ({ timelineEntry } : {timelineEntry: timelineEntry}) => {

  const date = new Date(timelineEntry.createdAt);
  const acceptedDate = getUniversalDate(date);

  return (
    <TimelineEntryView>
      <div>
        <span style={{ color: 'white' }}>
        User {timelineEntry.sessionId} has voted {timelineEntry.value}
        </span>
        <div>
          <Muted>
            {acceptedDate}
          </Muted>
        </div>
      </div>
    </TimelineEntryView>
  );
};

const TimelineEntryView = styled.div`
   ${({ theme }) => css`
    margin: 5px;
    background: ${theme.colors.primary};
  `}
`;

const TopicDetails = ({ QuestionnaireDetailResult }: { QuestionnaireDetailResult: QuestionnaireDetailResult }) => {
  const { customerName, title, description, creationDate, updatedAt, average, totalNodeEntries } = QuestionnaireDetailResult;
  return (
    <TopicDetailsView>
      <H2 color="default.text" fontWeight={400} mb={4}>
        {customerName} - {title}
      </H2>
      <Muted>
        {description}
      </Muted>
      <Hr />
      <div>
        creationDate: {creationDate}
      </div>
      <div>
        updatedAt: {updatedAt}
      </div>
      <div>
        Average score: {average} ({totalNodeEntries} answer(s))
      </div>
    </TopicDetailsView>
  );
};

const TopicDetailsView = styled.div`
  display: flex;
  flex-direction: column;
`;

const HistoryLogView = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 30%;
`;

const Hr = styled.hr`
  ${({ theme }) => css`
    border-top: 1px solid ${theme.colors.default.light};
  `}
`;

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

export default TopicView;
