import React from 'react';

import {
  DialogueImpactScoreType,
  useGetDialogueTopicsQuery,
  useGetSessionPathsQuery,
  useGetWorkspaceDialogueStatisticsQuery,
} from 'types/generated-types';
import { useCustomer } from 'providers/CustomerProvider';

import { DataLoadOptions, WorkspaceGrid } from './WorkspaceGrid';
import { HexagonNode, HexagonNodeType, HexagonViewMode } from './WorkspaceGrid.types';

interface WorkspaceGridAdapterProps {
  height: number;
  width: number;
  backgroundColor: string;
}

/**
 * Implements the WorkspaceGrid component, by fetching data.
 * @param param0
 * @returns
 */
export const WorkspaceGridAdapter = ({
  height,
  width,
  backgroundColor,
}: WorkspaceGridAdapterProps) => {
  const { activeCustomer } = useCustomer();

  const { data } = useGetWorkspaceDialogueStatisticsQuery({
    variables: {
      startDateTime: '01-01-2022',
      endDateTime: '01-07-2022',
      workspaceId: activeCustomer?.id || '',
    },
    fetchPolicy: 'cache-and-network',
  });

  const { refetch: fetchGetDialogues } = useGetDialogueTopicsQuery({
    skip: true,
  });

  const { refetch: fetchGetSessions } = useGetSessionPathsQuery({
    skip: true,
  });

  const dialogues: HexagonNode[] = data?.customer?.dialogues?.map((dialogue) => ({
    id: dialogue.id,
    type: HexagonNodeType.Dialogue,
    label: dialogue.title,
    score: dialogue.dialogueStatisticsSummary?.impactScore ?? 0,
    dialogue,
  })) || [];

  const handleLoadData = async (options: DataLoadOptions): Promise<[HexagonNode[], HexagonViewMode]> => {
    const { data: loadedData } = await fetchGetDialogues({
      dialogueId: options.dialogueId,
      input: {
        value: options.topic || '',
        isRoot: !options.topic,
        startDateTime: '20-03-2022',
        impactScoreType: DialogueImpactScoreType.Average,
      },
    });

    const nodes: HexagonNode[] = loadedData?.dialogue?.topic?.subTopics?.map((topic) => ({
      id: topic.name,
      type: HexagonNodeType.QuestionNode,
      score: topic.impactScore,
      topic: topic.name,
    })) || [];

    if (nodes.length) return [nodes, HexagonViewMode.QuestionNode];

    const { data: sessionData } = await fetchGetSessions({
      input: {
        startDateTime: '20-03-2022',
        path: options.topics || [],
      },
      dialogueId: options.dialogueId,
    });

    const fetchNodes: HexagonNode[] = sessionData.dialogue?.pathedSessions?.map((session) => ({
      id: session.id,
      type: HexagonNodeType.Session,
      score: session.score,
    })) || [];

    if (fetchNodes.length) return [fetchNodes, HexagonViewMode.Session];

    return [[], HexagonViewMode.Final];
  };

  const initialViewMode = HexagonViewMode.Dialogue;

  // Add spinner
  if (!dialogues.length) return null;

  return (
    <WorkspaceGrid
      backgroundColor={backgroundColor}
      initialViewMode={initialViewMode}
      initialData={dialogues}
      onLoadData={handleLoadData}
      height={height}
      width={width}
    />
  );
};
