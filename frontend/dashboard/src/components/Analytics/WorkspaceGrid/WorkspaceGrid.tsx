import * as UI from '@haas/ui';
import { ProvidedZoom } from '@visx/zoom/lib/types';
import { Zoom } from '@visx/zoom';
import { motion } from 'framer-motion';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import useMeasure from 'react-use-measure';

import * as Modal from 'components/Common/Modal';
import { DatePicker } from 'components/Common/DatePicker';
import { InteractionModalCard } from 'views/InteractionsOverview/InteractionModalCard';
import { Loader } from 'components/Common/Loader/Loader';
import { useCustomer } from 'providers/CustomerProvider';

import * as LS from './WorkspaceGrid.styles';
import {
  HexagonDialogueNode,
  HexagonGroupNode,
  HexagonNode,
  HexagonNodeType,
  HexagonState,
  HexagonTopicNode,
  HexagonViewMode,
  HexagonWorkspaceNode,
} from './WorkspaceGrid.types';
import { HexagonGrid } from './HexagonGrid';
import { Layers } from './Layers';
import { WorkspaceGridHeader } from './WorkspaceGridHeader';
import { WorkspaceSummaryPane } from './SummaryPane/WorkspaceSummaryPane';
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
  const { activeCustomer } = useCustomer();
  const initialRef = React.useRef<HTMLDivElement>();
  // Local loading
  const [isLoading, setIsLoading] = useState(false);

  // Session-id if currently being tracked.
  const [sessionId, setSessionId] = useState<string | undefined>(undefined);

  const [ref, bounds] = useMeasure();
  const width = bounds.width || 600;
  const height = Math.max(bounds.height, 800);

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
  const previousLabels: string[] = historyQueue.map((state) => state.currentNode?.label || '');

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
  }, [resetWorkspaceGrid]);

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

  return (
    <LS.WorkspaceGridContainer backgroundColor={backgroundColor}>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'absolute',
            top: '0',
            left: '0',
            right: '0',
            bottom: '0',
            zIndex: 1000,
          }}
        >
          <UI.Div style={{ position: 'absolute', bottom: '0' }}>
            <Loader testId="load" />
          </UI.Div>
        </motion.div>
      )}

      <UI.Div borderRadius={20} position="relative">
        <Zoom<SVGElement>
          width={width}
          height={height}
          scaleYMax={1.5}
          scaleYMin={0.5}
        >
          {(zoom) => (
            <UI.ColumnFlex alignItems="center">
              <WorkspaceGridHeader
                previousStateLabels={previousLabels}
                currentState={currentState}
                workspaceName={activeCustomer?.name || ''}
              />
              <UI.Div mb={4} zIndex={1000} position="relative">
                <UI.Flex mt={2}>
                  <DatePicker
                    type="range"
                    startDate={startDate}
                    endDate={endDate}
                    onChange={setDateRange}
                  />

                  <UI.LoaderSlot
                    mr={1}
                    position="absolute"
                    left={-36}
                    top="50%"
                    style={{ transform: 'translateY(-20%)' }}
                  >
                    {isServerLoading && (
                      <UI.Div display="inline-block">
                        <UI.Loader data-testId="load" />
                      </UI.Div>
                    )}
                  </UI.LoaderSlot>

                </UI.Flex>
              </UI.Div>

              <UI.Container mt={2}>
                <UI.Grid gridTemplateRows="1fr 250px">
                  <UI.Div ref={ref}>
                    <HexagonGrid
                      width={width}
                      height={height}
                      backgroundColor="#ebf0ff"
                      nodes={hexagonNodes}
                      onHexClick={handleHexClick}
                      stateKey={currentState.currentNode?.id || ''}
                      zoom={zoom}
                      useBackgroundPattern
                    />
                  </UI.Div>
                  <UI.Div>
                    <WorkspaceSummaryPane
                      startDate={startDate}
                      endDate={endDate}
                      onDialogueChange={jumpToDialogue}
                      currentState={currentState}
                      historyQueue={historyQueue}
                    />
                  </UI.Div>
                </UI.Grid>

              </UI.Container>
            </UI.ColumnFlex>
          )}
        </Zoom>
        <UI.Div position="absolute" bottom={0} right={24} style={{ transform: 'translateY(-50%)' }}>
          <Layers
            currentState={currentState}
            onClick={(index) => popToIndex(index)}
            historyQueue={historyQueue}
          />
        </UI.Div>
      </UI.Div>

      <Modal.Root open={!!sessionId} onClose={() => setSessionId(undefined)}>
        <InteractionModalCard
          sessionId={sessionId || ''}
        />
      </Modal.Root>
    </LS.WorkspaceGridContainer>
  );
};
