/* eslint-disable react/jsx-one-expression-per-line */
import React, { useState, Dispatch, SetStateAction } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { H2, Flex, Muted } from '@haas/ui';
import styled, { css } from 'styled-components';
import { useParams } from 'react-router-dom';

import getQuestionnaireData from '../queries/getQuestionnaireData';
import getSessionAnswerFlow from '../queries/getSessionAnswerFlow';
import { margin, alignSelf } from 'styled-system';

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

interface INodeEntryValue {
  numberValue?: number;
  textValue?: string;
  id: string;
}

interface IRelatedNode {
  title: string;
}

interface INodeEntry {
  values: Array<INodeEntryValue>;
  relatedNode: IRelatedNode;
}

const TopicView = () => {
  const { topicId } = useParams();
  const [currSession, setCurrSession] = useState('');
  console.log('Current session: ', currSession);

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
        <HistoryLog setCurrSession={setCurrSession} timelineEntries={resultData?.timelineEntries} />
      </Flex>
      <Hr />
      <TopicAnswerFlow sessionId={currSession} />
    </>
  );
};

const TopicAnswerFlowView = styled.div`
  margin-top: 10px;
`;

const TopicAnswerFlow = ({ sessionId }: { sessionId: string }) => {
  const { loading, error, data } = useQuery(getSessionAnswerFlow, {
    variables: { sessionId },
  });

  console.log('Topic answer flow: ', data);

  if (loading) {
    return <div />;
  }

  const session = data?.session;

  return (
    <TopicAnswerFlowView>
      <H2 color="default.text" fontWeight={400} mb={4}>
        {session ? `Answer flow - ${sessionId}` : 'Answer flow'}
      </H2>
      {
        !session && (
          <>
            <div>No session selected...</div>
          </>
        )
      }
      {
        session && (
          <>
            {
              session && session?.nodeEntries.map((nodeEntry: INodeEntry, index: number) => <TopicAnswerEntry key={index} nodeEntry={nodeEntry} />)
            }
          </>
        )
      }
    </TopicAnswerFlowView>
  );
};

const TopicAnswerEntry = ({ nodeEntry }: { nodeEntry: INodeEntry }) => {
  return (
    <TopicAnswerEntryView>
      <div>
        Question: {nodeEntry.relatedNode.title}
      </div>
      <div>
        <strong>
        Answer: {nodeEntry.values?.[0].numberValue ? nodeEntry.values?.[0].numberValue : nodeEntry.values?.[0].textValue}
        </strong>
      </div>
      <Hr />
    </TopicAnswerEntryView>
  );
};

const TopicAnswerEntryView = styled.div`
  margin: 10px;
`;

const HistoryLog = ({ setCurrSession, timelineEntries }: { setCurrSession: Dispatch<SetStateAction<string>>, timelineEntries: Array<timelineEntry> }) => {
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
        timelineEntries && timelineEntries.length > 0 && timelineEntries?.map(
          (timelineEntry, index) => <TimelineEntry setCurrSession={setCurrSession} key={index} timelineEntry={timelineEntry} />)
      }
      {
        ((timelineEntries && timelineEntries.length === 0) || (!timelineEntries)) && <div style={{ margin: '5px 20px' }}>No data available...</div>
      }
    </HistoryLogView>
  );
};

const getUniversalDate = (date: Date) => {
  const result = `${date.getDate().toString()}-${monthMap.get(date.getMonth())}-${date.getFullYear().toString()}`;
  return result;
};

const TimelineEntry = ({ setCurrSession, timelineEntry }: { setCurrSession: Dispatch<SetStateAction<string>>, timelineEntry: timelineEntry }) => {

  const date = new Date(timelineEntry.createdAt);
  const acceptedDate = getUniversalDate(date);

  return (
    <TimelineEntryView onClick={() => setCurrSession(timelineEntry.sessionId)}>
      <div>
        <div style={{ color: 'white', margin: '5px' }}>
          User {timelineEntry.sessionId} has voted {timelineEntry.value}
        </div>
        <div>
          <p style={{ color: 'white', fontSize: '0.8rem', margin: '5px' }}>
            {acceptedDate}
          </p>
        </div>
      </div>
    </TimelineEntryView>
  );
};

const TimelineEntryView = styled.div`
   ${({ theme }) => css`
    margin: 5px 20px;
    box-shadow: 0px 0px 2px 0px rgba(0,0,0,0.75);
    background: ${theme.colors.secondary};
    cursor: pointer;
    :hover {
      background: ${theme.colors.primary};
    }
  `}
`;

const TopicDetails = ({ QuestionnaireDetailResult }: { QuestionnaireDetailResult: QuestionnaireDetailResult }) => {
  console.log(QuestionnaireDetailResult?.average);

  return (
    <TopicDetailsView>
      {
        QuestionnaireDetailResult && (
          <>
            <H2 color="default.text" fontWeight={400} mb={4}>
              {QuestionnaireDetailResult?.customerName} - {QuestionnaireDetailResult?.title}
            </H2>
            <Muted>
              {QuestionnaireDetailResult?.description}
            </Muted>
            <Hr />
            <div style={{ marginTop: '10px' }}>
              Created at: {getUniversalDate(new Date(QuestionnaireDetailResult?.creationDate))}
            </div>
            <div>
              {
                QuestionnaireDetailResult?.average !== 'false' && (
                  <Score>
                    <div style={{ marginTop: '5px', alignSelf: 'centre' }}>
                      Average score:
                    </div>
                    <div style={{ marginLeft: '5px', fontSize: '200%', alignSelf: 'flex-start' }}>
                      { parseFloat(QuestionnaireDetailResult?.average).toPrecision(4) }/
                    </div>
                    <div style={{ alignSelf: 'flex-end', marginBottom: '2px' }}>
                      {QuestionnaireDetailResult?.totalNodeEntries} answer(s)
                    </div>
                  </Score>
                )
              }

            </div>
          </>
        )
      }
    </TopicDetailsView>
  );
};

const Score = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const TopicDetailsView = styled.div`
  display: flex;
  align-self: flex-start;
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
