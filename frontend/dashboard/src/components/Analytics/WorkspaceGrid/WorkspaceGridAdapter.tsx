import React from 'react';

import { useCustomer } from 'providers/CustomerProvider';
import { useGetWorkspaceDialogueStatisticsQuery } from 'types/generated-types';

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

  const dialogues = data?.customer?.dialogues?.map((dialogue) => ({ ...dialogue, type: 'Dialogue' })) || [];
  const dialoguesCloneSlice = dialogues.map((dialogue) => ({
    ...dialogue,
    type: 'QuestionNode',
    dialogueStatisticsSummary: {
      ...dialogue.dialogueStatisticsSummary,
      impactScore: 10,
    },
  }));

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
