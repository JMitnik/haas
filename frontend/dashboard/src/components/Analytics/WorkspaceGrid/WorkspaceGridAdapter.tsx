import React, { useMemo } from 'react';

import {
  DialogueImpactScoreType,
  useGetDialogueTopicsQuery,
  useGetSessionPathsQuery,
  useGetWorkspaceDialogueStatisticsQuery,
} from 'types/generated-types';
import { useCustomer } from 'providers/CustomerProvider';

import { DataLoadOptions, WorkspaceGrid } from './WorkspaceGrid';
import { HexagonNode, HexagonNodeType, HexagonViewMode } from './WorkspaceGrid.types';
import { groupsFromDialogues } from './WorkspaceGrid.helpers';

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

  const dialogues = data?.customer?.dialogues || [];

  const handleLoadData = async (options: DataLoadOptions): Promise<[HexagonNode[], HexagonViewMode]> => {
    console.log(options);

    if (options.clickedGroup) {
      return [options.clickedGroup.subGroups, HexagonViewMode.Group];
    }
    const { data: loadedData } = await fetchGetDialogues({
      dialogueId: options.dialogueId,
      input: {
        value: options.topic || '',
        isRoot: !options.topic,
        startDateTime: '24-03-2022',
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
        startDateTime: '24-03-2022',
        path: options.topics || [],
        refresh: false,
      },
      dialogueId: options.dialogueId,
    });

    const fetchNodes: HexagonNode[] = sessionData.dialogue?.pathedSessions?.pathedSessions?.map((session) => ({
      id: session.id,
      type: HexagonNodeType.Session,
      score: session.score,
      session,
    })) || [];

    if (fetchNodes.length) return [fetchNodes, HexagonViewMode.Session];

    return [[], HexagonViewMode.Final];
  };

  const initialViewMode = HexagonViewMode.Dialogue;

  const initialData = useMemo(() => groupsFromDialogues(dialogues), [dialogues]);

  // Add spinner
  if (!dialogues.length) return null;

  return (
    <WorkspaceGrid
      backgroundColor={backgroundColor}
      initialViewMode={initialViewMode}
      initialData={initialData}
      onLoadData={handleLoadData}
      height={height}
      width={width}
    />
  );
};
