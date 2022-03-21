import React from 'react';

import { useCustomer } from 'providers/CustomerProvider';
import { useGetWorkspaceDialogueStatisticsQuery } from 'types/generated-types';

import { HexagonNode, HexagonNodeType } from './WorkspaceGrid.types';
import { WorkspaceGrid } from './WorkspaceGrid';

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

  const dialogues: HexagonNode[] = data?.customer?.dialogues?.map((dialogue) => ({
    id: dialogue.id,
    type: HexagonNodeType.Dialogue,
    score: dialogue.dialogueStatisticsSummary?.impactScore ?? 0,
    dialogue,
  })) || [];

  const dialoguesCloneSlice: HexagonNode[] = data?.customer?.dialogues?.map((dialogue) => ({
    id: `${dialogue.id}_clone`,
    type: HexagonNodeType.QuestionNode,
    score: dialogue.dialogueStatisticsSummary?.impactScore ?? 0,
  })) || [];

  const dialogueLayerTwo = [
    ...dialoguesCloneSlice.map((item) => ({ ...item, id: `${item.id}a` })),
    ...dialoguesCloneSlice.map((item) => ({ ...item, id: `${item.id}b` })),
  ];

  return (
    <WorkspaceGrid
      backgroundColor={backgroundColor}
      data_L0={dialogues}
      data_L1={dialogueLayerTwo}
      height={height}
      width={width}
    />
  );
};
