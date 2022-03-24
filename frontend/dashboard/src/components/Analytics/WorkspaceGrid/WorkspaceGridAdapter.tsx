import React from 'react';

import {
  DialogueImpactScoreType,
  useGetDialogueTopicsQuery,
  useGetWorkspaceDialogueStatisticsQuery,
} from 'types/generated-types';
import { useCustomer } from 'providers/CustomerProvider';

import { DataLoadOptions, WorkspaceGrid } from './WorkspaceGrid';
import { HexagonNode, HexagonNodeType } from './WorkspaceGrid.types';

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

  const { refetch } = useGetDialogueTopicsQuery({});

  const dialogues: HexagonNode[] = data?.customer?.dialogues?.map((dialogue) => ({
    id: dialogue.id,
    type: HexagonNodeType.Dialogue,
    label: dialogue.title,
    score: dialogue.dialogueStatisticsSummary?.impactScore ?? 0,
    dialogue,
  })) || [];

  const handleLoadData = async (options: DataLoadOptions): Promise<HexagonNode[]> => {
    const { data: loadedData } = await refetch({
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
      label: topic.name,
    })) || [];

    return nodes;
  };

  return (
    <WorkspaceGrid
      backgroundColor={backgroundColor}
      initialData={dialogues}
      onLoadData={handleLoadData}
      height={height}
      width={width}
    />
  );
};
