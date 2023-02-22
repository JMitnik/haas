import React, { useMemo, useState } from 'react';

import { DateFormat, useDate } from 'hooks/useDate';
import { useCustomer } from 'providers/CustomerProvider';
import {
  useGetSessionPathsLazyQuery,
  useGetWorkspaceDialogueStatisticsQuery,
} from 'types/generated-types';

import * as LS from './WorkspaceGrid.styles';
import { DataLoadOptions, WorkspaceGrid } from './WorkspaceGrid';
import { Dialogue, HexagonNode, HexagonNodeType, HexagonViewMode } from './WorkspaceGrid.types';
import { groupsFromDialogues, mapNodeTypeToViewType } from './WorkspaceGrid.helpers';

export interface WorkspaceGridAdapterProps {
  backgroundColor: string;
}

/**
 * Implements the WorkspaceGrid component, by fetching data.
 * @param param0
 * @returns
 */
export const WorkspaceGridAdapter = ({
  backgroundColor,
}: WorkspaceGridAdapterProps) => {
  const { getOneWeekAgo, format, getEndOfToday } = useDate();
  const [dateRange, setDateRange] = useState<[Date, Date]>(() => {
    const startDate = getOneWeekAgo();
    const endDate = getEndOfToday();

    return [startDate, endDate];
  });

  const [selectedStartDate, selectedEndDate] = dateRange;
  const [dialogues, setDialogues] = useState<Dialogue[]>([]);

  const { activeCustomer } = useCustomer();

  useGetWorkspaceDialogueStatisticsQuery({
    variables: {
      startDateTime: format(selectedStartDate, DateFormat.DayFormat),
      endDateTime: format(selectedEndDate, DateFormat.DayFormat),
      workspaceId: activeCustomer?.id || '',
    },
    fetchPolicy: 'no-cache',
    skip: !(!!selectedStartDate && !!selectedEndDate),
    onCompleted: (data) => {
      setDialogues(data.customer?.statistics?.workspaceStatisticsSummary || []);
    },
  });

  const [fetchGetSessions] = useGetSessionPathsLazyQuery();

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
      variables: {
        input: {
          startDateTime: format(selectedStartDate, DateFormat.DayFormat),
          endDateTime: format(selectedEndDate, DateFormat.DayFormat),
          path: options.topics || [],
          refresh: true,
          issueOnly: options.issueOnly,
        },
        dialogueId: options.dialogueId as string,
      },
    });

    const fetchNodes: HexagonNode[] = sessionData?.dialogue?.pathedSessionsConnection?.pathedSessions?.map(
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

  return (
    <LS.WorkspaceGridAdapterContainer>
      <WorkspaceGrid
        dateRange={dateRange}
        setDateRange={setDateRange}
        backgroundColor={backgroundColor}
        initialViewMode={initialViewMode}
        initialData={initialData}
        onLoadData={handleLoadData}
      />
    </LS.WorkspaceGridAdapterContainer>
  );
};
