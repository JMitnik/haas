import * as UI from '@haas/ui';
import { AlertTriangle, MessageCircle, User } from 'react-feather';
import { ProvidedZoom } from '@visx/zoom/lib/types';
import { Zoom } from '@visx/zoom';
import { useTranslation } from 'react-i18next';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import useMeasure from 'react-use-measure';

import * as Modal from 'components/Common/Modal';
import { DateFormat, useDate } from 'hooks/useDate';
import { DatePicker } from 'components/Common/DatePicker';
import { DialogueImpactScoreType, useGetIssuesQuery, useGetWorkspaceSummaryDetailsQuery } from 'types/generated-types';
import { ReactComponent as EmptyIll } from 'assets/images/empty.svg';
import { InteractionModalCard } from 'views/InteractionsOverview/InteractionModalCard';
import { SimpleIssueTable } from 'components/Analytics/Issues/SimpleIssueTable';
import { useCustomer } from 'providers/CustomerProvider';

import * as LS from './WorkspaceGrid.styles';
import { BreadCrumb } from './BreadCrumb';
import { HealthCardWide } from '../Common/HealthCard/HealthCardWide';
import {
  HexagonDialogueNode,
  HexagonGroupNode,
  HexagonNode,
  HexagonNodeType,
  HexagonState,
  HexagonTopicNode,
  HexagonViewMode,
  HexagonWorkspaceNode,
  Issue,
} from './WorkspaceGrid.types';
import { HexagonGrid } from './HexagonGrid';
import { IssuesModal } from './IssuesModal';
import { Statistic } from './Statistic';
import { createGrid, extractDialogueFragments, reconstructHistoryStack } from './WorkspaceGrid.helpers';

export interface DataLoadOptions {
  dialogueId?: string;
  topic?: string;
  topics?: string[];
  clickedGroup?: HexagonGroupNode;
}

export interface WorkspaceGridProps {
  initialData: HexagonNode[];
  width: number;
  height: number;
  backgroundColor: string;
  dateRange: [Date, Date];
  setDateRange: (dateRange: [Date, Date]) => void;
  isLoading?: boolean;
  isServerLoading?: boolean;
  initialViewMode?: HexagonViewMode;
  onLoadData?: (options: DataLoadOptions) => Promise<[HexagonNode[], HexagonViewMode]>;
}

export const WorkspaceGrid = ({
  initialData,
  backgroundColor,
  onLoadData,
  dateRange: [startDate, endDate],
  setDateRange,
  initialViewMode = HexagonViewMode.Workspace,
  isServerLoading = false,
}: WorkspaceGridProps) => {
  const { format } = useDate();
  const { activeCustomer } = useCustomer();
  const initialRef = React.useRef<HTMLDivElement>();
  const { t } = useTranslation();
  // Local loading
  const [isLoading, setIsLoading] = useState(false);

  const [issuesModalIsOpen, setIssuesModalIsOpen] = useState(false);

  // Session-id if currently being tracked.
  const [sessionId, setSessionId] = useState<string | undefined>(undefined);

  const [ref, bounds] = useMeasure();
  const width = bounds.width || 600;
  const height = Math.max(bounds.height, 600);

  /**
   * The current state describes that state of the workspace grid component, including the node
   * that was clicked just now, the candidate child nodes that can be clicked next, and a general global "state" what
   * type of view is currently being shown.
   */
  const [currentState, setCurrentState] = React.useState<HexagonState>({
    currentNode: {
      id: activeCustomer?.id,
      label: activeCustomer?.name,
      score: 0,
      type: HexagonNodeType.Workspace,
    } as HexagonWorkspaceNode,
    childNodes: initialData,
    viewMode: initialViewMode,
  });

  /**
   * The history stack tracks previous states of the workspace grid component. Utilized for things like the layers,
   * breadcrumb navigations, and such.
   *
   * Can be read as queue by reversing the stack, via `historyQueue`.
   * The `previousLabels` are the queue labels.
   */
  const [stateHistoryStack, setStateHistoryStack] = React.useState<HexagonState[]>([]);
  const historyQueue = [...stateHistoryStack].reverse();
  const previousLabels: string[] = extractDialogueFragments(historyQueue);

  /**
   * If the last selected node was a dialogue, then the activeDialogue will point to that dialogue.
   */
  const activeDialogue = useMemo(() => {
    const activeNode = stateHistoryStack.find((state) => state.selectedNode?.type === HexagonNodeType.Dialogue);
    return (activeNode?.selectedNode as HexagonDialogueNode)?.dialogue || undefined;
  }, [currentState]);

  /**
   * Resets the entire grid state to the beginning.
   * Used when one of the following changes:
   * - Initial data (think of filters)
   * - The workspace changes.
   */
  const resetWorkspaceGrid = useCallback(() => {
    setCurrentState({
      currentNode: {
        id: activeCustomer?.id,
        label: activeCustomer?.name,
        score: 0,
        type: HexagonNodeType.Workspace,
      } as HexagonWorkspaceNode,
      childNodes: initialData,
      viewMode: initialViewMode,
    });
    setStateHistoryStack([]);
  }, [activeCustomer, initialData, initialViewMode, setStateHistoryStack]);

  useEffect(() => {
    resetWorkspaceGrid();
  }, [resetWorkspaceGrid, startDate, endDate]);

  /**
   * Generates an array of Hexagon SVG coordinates according to the desired shape.
   *
   * The entries in the array correspond to `currentState.childNodes`, and can be accessed by the indices.
   */
  const gridItems = useMemo(() => (
    createGrid(
      currentState?.childNodes?.length || 0,
      initialRef.current?.clientHeight || 495,
      initialRef.current?.clientWidth || 495,
    )
  ), [initialData, currentState.childNodes]);

  /**
   * Adds the generated SVG coordinates to the hexagon nodes.
   */
  const hexagonNodes = currentState.childNodes?.map((node, index) => ({
    ...node,
    id: node.id,
    points: gridItems.points[index],
  })) || [];

  /**
   * Method for traversing the `historyStack` backwards by using an index to jump to the appropriate position.
   */
  const popToIndex = (index: number) => {
    if (index === historyQueue.length) return;

    // The zeroth index means we are at the root
    const newQueue = [...historyQueue].slice(0, index + 1);
    const newStack = [...newQueue].reverse();

    setStateHistoryStack([...historyQueue].slice(0, index).reverse());

    const newState = newStack.length > 0 ? newStack[0] : undefined;

    if (newState) {
      setCurrentState(newState);
    } else {
      setCurrentState({
        currentNode: undefined,
        childNodes: initialData,
        viewMode: initialViewMode,
      });
    }
  };

  /**
   * Method for traversing the `historyStack` forwards until a particular dialogue.
   * - Useful for skipping groups.
   * - Allows for additional filtering, by only retrieving sessions mentioning certain `topics`.
   */
  const jumpToDialogue = async (dialogueId: string, topics?: string[]) => {
    if (!onLoadData) return;

    const [sessions, viewMode] = await onLoadData({
      dialogueId,
      topics,
    });

    const reconstructedHistoryStack = reconstructHistoryStack(dialogueId, initialData);
    setStateHistoryStack(reconstructedHistoryStack);

    setCurrentState({ childNodes: sessions, viewMode });
  };

  /**
   * Method for when a user clicks on a node. This will typically zoom in on the hexagon node (drill-down).
   */
  const handleHexClick = async (currentZoomHelper: ProvidedZoom<SVGElement>, clickedNode: HexagonNode) => {
    // PHASE 1: Prevent termination states from being clicked.

    // If we somehow trigger this while being in the termination state (Final), ignore the click.
    // NOTE: This should generally never happen, but it's here just in case.
    if (currentState.viewMode === HexagonViewMode.Final) return;

    // If we are at the other termination state (Session), and the node clicked was a session, set it to be active.
    // This will trigger the modal.
    if (currentState.viewMode === HexagonViewMode.Session && clickedNode.type === HexagonNodeType.Session) {
      setSessionId(clickedNode.session.id);
      return;
    }

    // PHASE 2: Update History Stack

    // Update the history with the last state.
    const newStateHistory = [{
      currentNode: currentState.currentNode,
      childNodes: currentState.childNodes,
      selectedNode: clickedNode,
      viewMode: currentState.viewMode,
    }, ...stateHistoryStack];
    setStateHistoryStack(newStateHistory);

    if (!onLoadData) return;

    // PHASE 3: Fetch the children

    // If we clicked on group, load the groups children (other groups / dialogues), and set that state.
    if (clickedNode.type === HexagonNodeType.Group) {
      const [newNodes, hexagonViewMode] = await onLoadData({
        clickedGroup: clickedNode.type === HexagonNodeType.Group ? clickedNode : undefined,
      }).finally(() => setIsLoading(false));

      setCurrentState({ currentNode: clickedNode, childNodes: newNodes, viewMode: hexagonViewMode });
      return;
    }

    // If we clicked on a dialogue, load the underlying topics or sessions.
    const dialogueId = clickedNode.type === HexagonNodeType.Dialogue ? clickedNode.id : activeDialogue?.id;
    if (!dialogueId) return;
    setIsLoading(true);

    const topics = newStateHistory
      .filter((state) => state.selectedNode?.type === HexagonNodeType.Topic)
      .map((state) => (state.selectedNode as HexagonTopicNode)?.topic);

    const [newNodes, hexagonViewMode] = await onLoadData({
      dialogueId,
      topic: clickedNode.type === HexagonNodeType.Topic ? clickedNode.topic.name : '',
      topics: topics.map((topic) => topic.name),
    }).finally(() => setIsLoading(false));

    setCurrentState({ currentNode: clickedNode, childNodes: newNodes, viewMode: hexagonViewMode });
  };

  const handleIssueClick = (issue: Issue) => {
    if (issue.dialogue?.id) {
      jumpToDialogue(issue.dialogue.id);
    }
  };

  const visitedDialogueFragments = useMemo(() => extractDialogueFragments(historyQueue), [historyQueue]);

  const { data, loading: summaryIsLoading } = useGetWorkspaceSummaryDetailsQuery({
    fetchPolicy: 'no-cache',
    variables: {
      id: activeCustomer?.id,
      healthInput: {
        startDateTime: format(startDate, DateFormat.DayFormat),
        endDateTime: format(endDate, DateFormat.DayFormat),
        topicFilter: {
          dialogueStrings: visitedDialogueFragments,
        },
      },
      summaryInput: {
        impactType: DialogueImpactScoreType.Average,
        startDateTime: format(startDate, DateFormat.DayFormat),
        endDateTime: format(endDate, DateFormat.DayFormat),
        topicsFilter: {
          dialogueStrings: visitedDialogueFragments,
        },
        refresh: true,
      },
    },
  });

  const summary = data?.customer?.statistics;

  const { data: issuesData } = useGetIssuesQuery({
    fetchPolicy: 'no-cache',
    variables: {
      workspaceId: activeCustomer?.id || '',
      filter: {
        startDate: format(startDate, DateFormat.DayFormat),
        endDate: format(endDate, DateFormat.DayFormat),
        dialogueStrings: visitedDialogueFragments,
      },
    },
  });

  const issues = issuesData?.customer?.issues || [];

  // Various stats fields
  const health = summary?.health;

  const noData = !summaryIsLoading && health?.nrVotes === 0;

  return (
    <LS.WorkspaceGridContainer backgroundColor={backgroundColor}>
      <UI.Container px={4}>
        <UI.Flex position="relative" zIndex={200} justifyContent="space-between" py={4} flexWrap="wrap">
          <UI.Div>
            <UI.H2 lineHeight="1" textAlign="left" fontWeight="900" color="main.500">
              {activeCustomer?.name}
            </UI.H2>
          </UI.Div>

          <UI.Div>
            <DatePicker
              type="range"
              startDate={startDate}
              endDate={endDate}
              onChange={setDateRange}
            />
          </UI.Div>
        </UI.Flex>

        <UI.Hr />

        <UI.Grid gridTemplateColumns={['1fr', '1fr', '1fr', '1fr', '2fr 1fr']}>
          <UI.Div>
            {noData && (
              <UI.IllustrationCard svg={<EmptyIll />} text={t('dashboard_no_data_with_filter')} />
            )}

            {!!health?.nrVotes && health.nrVotes > 0 && (
              <>
                <UI.Grid gridTemplateColumns={['1fr', '1fr', '1fr', '1fr', '1fr 1fr']}>
                  <UI.Grid gridTemplateColumns={['1fr 1fr 1fr', '1fr 1fr 1fr', '1fr 1fr 1fr', '1fr 1fr 1fr', '1fr']}>
                    <Statistic
                      icon={<User height={40} width={40} />}
                      themeBg="green.500"
                      themeColor="white"
                      name="Total feedback"
                      value={health?.nrVotes || 0}
                      isFilterEnabled={historyQueue.length > 0}
                    />
                    <Statistic
                      icon={<AlertTriangle height={40} width={40} />}
                      themeBg="red.500"
                      themeColor="white"
                      name="Total issues"
                      value={issues.length}
                      isFilterEnabled={historyQueue.length > 0}
                    />
                    <Statistic
                      icon={<MessageCircle height={40} width={40} />}
                      themeBg="main.500"
                      themeColor="white"
                      name="Total call-to-actions"
                      value={issues.filter((issue) => issue.followUpAction).length}
                      isFilterEnabled={historyQueue.length > 0}
                    />
                  </UI.Grid>
                  <UI.Div>
                    {health && (
                      <HealthCardWide
                        key={health.score}
                        score={health.score}
                        onResetFilters={() => popToIndex(0)}
                        isFilterEnabled={historyQueue.length > 0}
                        negativeResponseCount={health.negativeResponseCount}
                        positiveResponseCount={health.nrVotes - health.negativeResponseCount}
                      />
                    )}
                  </UI.Div>
                </UI.Grid>
                <UI.Div mt={4}>
                  <SimpleIssueTable
                    inPreview
                    onResetFilter={() => popToIndex(0)}
                    isFilterEnabled={historyQueue.length > 0}
                    issues={issues}
                    onIssueClick={handleIssueClick}
                    onOpenIssueModal={() => setIssuesModalIsOpen(true)}
                  />
                </UI.Div>
              </>
            )}

          </UI.Div>
          <UI.Div width="100%" ref={ref}>
            <Zoom<SVGElement>
              width={width}
              height={height}
              scaleYMax={1.5}
              scaleYMin={0.5}
            >
              {(zoom) => (
                <HexagonGrid
                  key={`${startDate.toISOString()} - ${endDate.toISOString()}`}
                  width={width}
                  height={height}
                  backgroundColor="#ebf0ff"
                  nodes={hexagonNodes}
                  onHexClick={handleHexClick}
                  stateKey={currentState.currentNode?.id || ''}
                  zoom={zoom}
                  useBackgroundPattern
                  onGoBack={() => popToIndex(stateHistoryStack.length - 1)}
                  isAtRoot={historyQueue.length === 0}
                >
                  <UI.Div position="absolute" left={12} top={12}>
                    {historyQueue.length > 0 && (
                      <BreadCrumb
                        maxWidth={width * 0.8}
                        viewMode={currentState.viewMode}
                        historyQueue={historyQueue}
                        onJumpToIndex={popToIndex}
                      />
                    )}
                  </UI.Div>
                </HexagonGrid>
              )}
            </Zoom>
          </UI.Div>
        </UI.Grid>
      </UI.Container>

      <Modal.Root open={!!sessionId} onClose={() => setSessionId(undefined)}>
        <InteractionModalCard
          sessionId={sessionId || ''}
        />
      </Modal.Root>

      <Modal.Root open={issuesModalIsOpen} onClose={() => setIssuesModalIsOpen(false)}>
        <IssuesModal
          onResetFilters={() => popToIndex(0)}
          issues={issues}
          onIssueClick={(issue) => {
            handleIssueClick(issue);
            setIssuesModalIsOpen(false);
          }}
          isFiltersEnabled={historyQueue.length > 0}
        />
      </Modal.Root>
    </LS.WorkspaceGridContainer>
  );
};
