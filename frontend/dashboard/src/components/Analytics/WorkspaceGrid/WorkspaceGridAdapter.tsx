import * as UI from '@haas/ui';
import { format, parse, sub } from 'date-fns';
import React, { useMemo } from 'react';

import {
  DialogueImpactScoreType,
  useGetDialogueTopicsQuery,
  useGetSessionPathsQuery,
  useGetWorkspaceDialogueStatisticsQuery,
} from 'types/generated-types';
import { ReactComponent as HoneyComb } from 'assets/icons/honeycomb.svg';
import { useCustomer } from 'providers/CustomerProvider';

import * as LS from './WorkspaceGrid.styles';
import { DataLoadOptions, WorkspaceGrid } from './WorkspaceGrid';
import { HexagonNode, HexagonNodeType, HexagonViewMode } from './WorkspaceGrid.types';
import { SingleHexagon } from './SingleHexagon';
import { groupsFromDialogues } from './WorkspaceGrid.helpers';

interface WorkspaceGridAdapterProps {
  height: number;
  width: number;
  backgroundColor: string;
}

export const isValidDateTime = (dateString: string) => {
  const formatString = dateString.split(':').length > 1 ? 'dd-MM-yyyy HH:mm' : 'dd-MM-yyyy';
  const isStartDate = type === 'START_DATE';
  const isWithTime = formatString === 'dd-MM-yyyy HH:mm';

  const dateObject = parse(
    dateString,
    formatString,
    new Date(),
  );

  const utcDate = zonedTimeToUtc(dateObject, 'UTC');

  if (!(utcDate instanceof Date) || Number.isNaN(utcDate.getSeconds())) {
    throw new UserInputError(isStartDate ? 'Start date invalid' : 'End date invalid');
  }

  return utcDate;
};

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

  const { refetch: fetchGetDialogues } = useGetDialogueTopicsQuery({
    skip: true,
  });

  const { refetch: fetchGetSessions } = useGetSessionPathsQuery({
    skip: true,
  });

  const dialogues = data?.customer?.dialogues || [];

  const handleLoadData = async (options: DataLoadOptions): Promise<[HexagonNode[], HexagonViewMode]> => {
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
      type: HexagonNodeType.Topic,
      score: topic.impactScore,
      topic,
    })) || [];

    if (nodes.length) return [nodes, HexagonViewMode.Topic];

    const { data: sessionData } = await fetchGetSessions({
      input: {
        startDateTime: '24-03-2022',
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

    return [[], HexagonViewMode.Final];
  };

  const initialViewMode = HexagonViewMode.Dialogue;

  const initialData = useMemo(() => groupsFromDialogues(dialogues), [dialogues]);

  // Add spinner
  if (!dialogues.length) return null;

  return (
    <LS.WorkspaceGridAdapterContainer>
      <LS.WidgetHeader>
        <UI.Flex>
          <UI.Div>
            <UI.Div
              px={1}
              py={1}
              border="1px solid"
              borderColor="cyan.300"
              backgroundColor="cyan.100"
              style={{ borderRadius: '10px' }}
              mr={3}
            >
              <UI.Icon width={30} height={30} color="cyan.400">
                <HoneyComb fill="currentColor" />
              </UI.Icon>
            </UI.Div>
          </UI.Div>
          <UI.Div>
            <UI.H4 mb={1}>Team overview</UI.H4>
            <UI.Div display="flex" alignItems="center">
              Discover and detect patterns in your teams. Red hexagons
              {' '}
              <UI.Span ml={1} mr={1}>
                <SingleHexagon fill="red" />
              </UI.Span>
              {' '}
              indicate trouble.
            </UI.Div>
          </UI.Div>
        </UI.Flex>
      </LS.WidgetHeader>
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
