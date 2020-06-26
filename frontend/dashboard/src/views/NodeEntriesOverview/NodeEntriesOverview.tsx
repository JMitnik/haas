import { useQuery } from '@apollo/react-hooks';
import React from 'react';

import { Div, H2, Loader } from '@haas/ui';

import { NodeEntriesOverviewContainer, NodeEntryContainer } from './NodeEntriesOverviewStyles';
import { NodeEntryProps } from './NodeEntriesOverviewInterfaces';
import getSessionAnswerFlow from '../../queries/getSessionAnswerFlow';

const NodeEntriesOverview = ({ sessionId }: { sessionId: string }) => {
  const { loading, data } = useQuery(getSessionAnswerFlow, {
    variables: { sessionId },
  });

  if (loading) return <Loader />;

  const session = data?.session;

  return (
    <NodeEntriesOverviewContainer>
      <H2 color="default.text" fontWeight={400} mb={4}>
        {session ? `Node entries - ${sessionId}` : 'Node entries'}
      </H2>
      {!session && (
        <>
          <Div>No session selected...</Div>
        </>
      )}
      {session && (
        <>
          {session && session?.nodeEntries.map((nodeEntry: NodeEntryProps, index: number) => (
            <NodeEntryItem key={index} nodeEntry={nodeEntry} />
          ))}
        </>
      )}
    </NodeEntriesOverviewContainer>
  );
};

const NodeEntryItem = ({ nodeEntry }: { nodeEntry: NodeEntryProps }) => (
  <NodeEntryContainer>
    <Div>{`Question:${nodeEntry.relatedNode.title}`}</Div>
    <Div>
      <strong>
        Answer:
        {nodeEntry.values?.[0].numberValue
        || nodeEntry.values?.[0].textValue
        || nodeEntry.values?.[0].multiValues?.map((value) => value.textValue)?.join(' ')}
      </strong>
    </Div>
  </NodeEntryContainer>
);

export default NodeEntriesOverview;
