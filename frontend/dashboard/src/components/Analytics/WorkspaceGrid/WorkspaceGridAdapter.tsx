import React, { useMemo, useState } from 'react';

import { DateFormat, useDate } from 'hooks/useDate';
import { useCustomer } from 'providers/CustomerProvider';
import {
  useGetIssuesQuery,
  useGetSessionPathsQuery,
  useGetWorkspaceDialogueStatisticsQuery,
} from 'types/generated-types';

import * as LS from './WorkspaceGrid.styles';
import { DataLoadOptions, WorkspaceGrid } from './WorkspaceGrid';
import { Dialogue, HexagonNode, HexagonNodeType, HexagonViewMode } from './WorkspaceGrid.types';
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
  const { getOneWeekAgo, format, getTomorrow } = useDate();
  const [dateRange, setDateRange] = useState<[Date, Date]>(() => {
    const startDate = getOneWeekAgo();
    const endDate = getTomorrow();

    return [startDate, endDate];
  });

  const [selectedStartDate, selectedEndDate] = dateRange;
  const [dialogues, setDialogues] = useState<Dialogue[]>([]);

  const { activeCustomer } = useCustomer();

  const { loading: workspaceLoading } = useGetWorkspaceDialogueStatisticsQuery({
    variables: {
      startDateTime: format(selectedStartDate, DateFormat.DayFormat),
      endDateTime: format(selectedEndDate, DateFormat.DayFormat),
      workspaceId: activeCustomer?.id || '',
    },
    fetchPolicy: 'no-cache',
    skip: !(!!selectedStartDate && !!selectedEndDate),
    onCompleted: (data) => {
      setDialogues(data.customer?.dialogues || []);
    },
  });

  const { refetch: fetchGetSessions } = useGetSessionPathsQuery({ skip: true });

  const { data, loading: loadingIssues } = useGetIssuesQuery({
    variables: {
      workspaceId: activeCustomer?.id || '',
      filter: {
        startDate: format(selectedStartDate, DateFormat.DayFormat),
        endDate: format(selectedEndDate, DateFormat.DayFormat),
      }
    }
  });

  const issues = data?.customer?.issues || [];

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
        startDateTime: format(selectedStartDate, DateFormat.DayFormat),
        endDateTime: format(selectedEndDate, DateFormat.DayFormat),
        path: options.topics || [],
        refresh: true,
      },
      dialogueId: options.dialogueId,
    });

    const fetchNodes: HexagonNode[] = sessionData.dialogue?.pathedSessionsConnection?.pathedSessions?.map(
      (session) => ({
        id: session.id,
        label: session.id,
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
  const initialViewMode = HexagonViewMode.Workspace;

  // TODO: Add spinner
  if (!dialogues.length) return null;

  const isServerLoading = workspaceLoading;

  return (
    <LS.WorkspaceGridAdapterContainer>
      <WorkspaceGrid
        isServerLoading={isServerLoading}
        issues={issues}
        dateRange={dateRange}
        setDateRange={setDateRange}
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
