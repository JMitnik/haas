import { format, sub } from 'date-fns';
import React, { useMemo } from 'react';

import { useCustomer } from 'providers/CustomerProvider';
import {
  useGetSessionPathsQuery,
  useGetWorkspaceDialogueStatisticsQuery,
} from 'types/generated-types';

import * as LS from './WorkspaceGrid.styles';
import { DataLoadOptions, WorkspaceGrid } from './WorkspaceGrid';
import { HexagonNode, HexagonNodeType, HexagonViewMode } from './WorkspaceGrid.types';
import { groupsFromDialogues, mapNodeTypeToViewType } from './WorkspaceGrid.helpers';

export interface WorkspaceGridAdapterProps {
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
      startDateTime: format(sub(new Date(), { weeks: 1 }), 'dd-MM-yyyy'),
      endDateTime: format(new Date(), 'dd-MM-yyyy'),
      workspaceId: activeCustomer?.id || '',
    },
    fetchPolicy: 'cache-and-network',
  });

  const { refetch: fetchGetSessions } = useGetSessionPathsQuery({ skip: true });

  const dialogues = data?.customer?.dialogues || [];

  /**
   * Fetches the various loading data requirements for the underlying WorkspaceGrid.
   *
   * Returns a Tuple consisting of Nodes and a View Mode
   */
  const handleLoadData = async (options: DataLoadOptions): Promise<[HexagonNode[], HexagonViewMode]> => {
    // Checkpoint one: If we clicked a group, return its subgroups (Groups or Dialogues)
    if (options.clickedGroup) {
      const subGroupType = options.clickedGroup.subGroups[0].type;
      return [options.clickedGroup.subGroups, mapNodeTypeToViewType(subGroupType)];
    }

    // Checkpoint three: Fetch all sessions for the current selected topics
    const { data: sessionData } = await fetchGetSessions({
      input: {
        startDateTime: format(sub(new Date(), { weeks: 1 }), 'dd-MM-yyyy'),
        endDateTime: format(new Date(), 'dd-MM-yyyy'),
        path: options.topics || [],
        refresh: false,
      },
      dialogueId: options.dialogueId,
    });

    const fetchNodes: HexagonNode[] = sessionData.dialogue?.pathedSessionsConnection?.pathedSessions?.map(
      (session) => ({
        id: session.id,
        type: HexagonNodeType.Session,
        score: session.score,
        session,
      }),
    ) || [];

    if (fetchNodes.length) return [fetchNodes, HexagonViewMode.Session];

    // Final checkpoint: Return a "Final" state
    return [[], HexagonViewMode.Final];
  };

  const initialData = useMemo(() => groupsFromDialogues(dialogues), [dialogues]);
  const initialViewMode = mapNodeTypeToViewType(initialData?.[0]?.type);

  // TODO: Add spinner
  if (!dialogues.length) return null;

  return (
    <LS.WorkspaceGridAdapterContainer>
      <WorkspaceGrid
        backgroundColor={backgroundColor}
        initialViewMode={initialViewMode}
        initialData={initialData}
        onLoadData={handleLoadData}
        height={height}
        width={width}
      />
    </LS.WorkspaceGridAdapterContainer>
  );
};
