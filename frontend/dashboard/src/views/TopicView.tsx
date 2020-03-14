/* eslint-disable react/jsx-one-expression-per-line */
import React from 'react';
import { useQuery, useApolloClient, useMutation } from '@apollo/react-hooks';
import { H2, H3, H4, Grid, Flex, Icon, Label, Div, Card, CardBody, CardFooter, Muted } from '@haas/ui';
import styled, { css } from 'styled-components';
import { Link, useHistory, useParams } from 'react-router-dom';

import { Query, Questionnaire, Customer, } from '../types';

import getQuestionnaireData from '../queries/getQuestionnaireData';

interface timelineEntry {
  sessionId: string;
  value: number;
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
  // Query to get following information: Aggregated value of slider values , All sessions
  const { topicId } = useParams();
  console.log('topic ID: ', topicId);

  const { loading, error, data } = useQuery(getQuestionnaireData, {
    variables: { topicId },
  });

  if (loading) {
    return (<div> loading... </div>);
  }

  const resultData = data?.getQuestionnaireData;
  console.log('QUESTIONNAIRE DATA: ', data);
  // const { customerName, title, description, creationDate, updatedAt, average, totalNodeEntries } = data?.getQuestionnaireData;
  return (
    <>
      <Flex height="100%" alignItems="center" justifyContent="space-between">
        <TopicDetails QuestionnaireDetailResult={resultData} />
        <HistoryLog timelineEntries={resultData.timelineEntries} />
      </Flex>
    </>
  );
};

const Hr = styled.hr`
  ${({ theme }) => css`
    border-top: 1px solid ${theme.colors.default.light};
  `}
`;

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

const TimelineEntry = ( { timelineEntry } : {timelineEntry: timelineEntry}) => {
  return (
    <>
      <div>
        User {timelineEntry.sessionId} has voted {timelineEntry.value}
      </div>
    </>
  )
}

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

export default TopicView;
