/* eslint-disable max-len */
/* eslint-disable react/jsx-one-expression-per-line */
import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { H2, Loader, Hr, Div } from '@haas/ui';
import getSessionAnswerFlow from '../../../queries/getSessionAnswerFlow';
import { AnswerFlowView, AnswerEntryView } from './AnserFlowOverviewStyles';
import { NodeEntryProps } from './AnswerFlowOverviewInterfaces';

const AnswerFlowOverview = ({ sessionId }: { sessionId: string }) => {
  const { loading, data } = useQuery(getSessionAnswerFlow, {
    variables: { sessionId },
  });

  if (loading) return <Loader />;

  const session = data?.session;

  return (
    <AnswerFlowView>
      <H2 color="default.text" fontWeight={400} mb={4}>
        {session ? `Answer flow - ${sessionId}` : 'Answer flow'}
      </H2>
      {
          !session && (
            <>
              <Div>No session selected...</Div>
            </>
          )
        }
      {
          session && (
            <>
              {
                session && session?.nodeEntries.map((nodeEntry: NodeEntryProps, index: number) => <TopicAnswerEntry key={index} nodeEntry={nodeEntry} />)
              }
            </>
          )
        }
    </AnswerFlowView>
  );
};

const TopicAnswerEntry = ({ nodeEntry }: { nodeEntry: NodeEntryProps }) => (
  <AnswerEntryView>
    <Div>
      Question: {nodeEntry.relatedNode.title}
    </Div>
    <Div>
      <strong>
        Answer: {nodeEntry.values?.[0].numberValue
        ? nodeEntry.values?.[0].numberValue
        : nodeEntry.values?.[0].textValue}
      </strong>
    </Div>
    <Hr />
  </AnswerEntryView>
);

export default AnswerFlowOverview;
