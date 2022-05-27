import * as UI from '@haas/ui';
import { AnimatePresence, motion } from 'framer-motion';
import { ProvidedZoom } from '@visx/zoom/lib/types';
import { Zoom } from '@visx/zoom';
import { uniqueId } from 'lodash';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import * as Modal from 'components/Common/Modal';
import { DatePicker } from 'components/Common/DatePicker';
import { InteractionModalCard } from 'views/InteractionsOverview/InteractionModalCard';
import { Loader } from 'components/Common/Loader/Loader';
import { useCustomer } from 'providers/CustomerProvider';

import * as LS from './WorkspaceGrid.styles';
import { HealthCard } from '../HealthCard/HealthCard';
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
import { createGrid, reconstructHistoryStack } from './WorkspaceGrid.helpers';

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
  const [id, setId] = useState('');
  const { activeCustomer } = useCustomer();
  const initialRef = React.useRef<HTMLDivElement>();
  const [stateHistoryStack, setStateHistoryStack] = React.useState<HexagonState[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = React.useState<string | undefined>(undefined);
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
    setId(uniqueId());
  }, [activeCustomer, initialData, initialViewMode, setStateHistoryStack]);

  useEffect(() => {
    resetWorkspaceGrid();
  }, [resetWorkspaceGrid]);

  const gridItems = useMemo(() => (
    createGrid(
      currentState?.childNodes?.length || 0,
      initialRef.current?.clientHeight || 495,
      initialRef.current?.clientWidth || 495,
    )
  ), [initialData, currentState.childNodes]);

  const hexagonNodes = currentState.childNodes?.map((node, index) => ({
    ...node,
    id: `${id}_${node.id}`,
    points: gridItems.points[index],
  })) || [];

  // ReversedHistory: Session => Dialogue => Group
  const historyQueue = [...stateHistoryStack].reverse();
  const previousLabels: string[] = historyQueue.map((state) => state.currentNode?.label || '');

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
   * If the current state has a DialogueNode, then sets the dialogueNode.
   */
  const activeDialogue = useMemo(() => {
    const activeNode = stateHistoryStack.find((state) => state.selectedNode?.type === HexagonNodeType.Dialogue);
    return (activeNode?.selectedNode as HexagonDialogueNode)?.dialogue || undefined;
  }, [currentState]);

  /**
   * If a user clicks on a hex.
   */
  const handleHexClick = async (currentZoomHelper: ProvidedZoom<SVGElement>, clickedNode: HexagonNode) => {
    if (currentState.viewMode === HexagonViewMode.Final) return;

    if (currentState.viewMode === HexagonViewMode.Session && clickedNode.type === HexagonNodeType.Session) {
      setSessionId(clickedNode.session.id);
      return;
    }

    // Empty canvas and unset soom
    // currentZoomHelper.reset();
    const newStateHistory = [{
      currentNode: currentState.currentNode,
      childNodes: currentState.childNodes,
      selectedNode: clickedNode,
      viewMode: currentState.viewMode,
    }, ...stateHistoryStack];
    setStateHistoryStack(newStateHistory);

    const topics = newStateHistory
      .filter((state) => state.selectedNode?.type === HexagonNodeType.Topic)
      .map((state) => (state.selectedNode as HexagonTopicNode)?.topic);

    if (!onLoadData) return;

    if (clickedNode.type === HexagonNodeType.Group) {
      const [newNodes, hexagonViewMode] = await onLoadData({
        clickedGroup: clickedNode.type === HexagonNodeType.Group ? clickedNode : undefined,
      }).finally(() => setIsLoading(false));

      setCurrentState({ currentNode: clickedNode, childNodes: newNodes, viewMode: hexagonViewMode });
      return;
    }

    const dialogueId = clickedNode.type === HexagonNodeType.Dialogue ? clickedNode.id : activeDialogue?.id;
    if (!dialogueId || !onLoadData) return;
    setIsLoading(true);

    const [newNodes, hexagonViewMode] = await onLoadData({
      dialogueId,
      topic: clickedNode.type === HexagonNodeType.Topic ? clickedNode.topic.name : '',
      topics: topics.map((topic) => topic.name),
    }).finally(() => setIsLoading(false));

    setCurrentState({ currentNode: clickedNode, childNodes: newNodes, viewMode: hexagonViewMode });
  };

  const width = 600;
  const height = 700;

  return (
    <LS.WorkspaceGridContainer backgroundColor={backgroundColor}>
      <AnimatePresence />
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
        >
          {(zoom) => (
            <UI.ColumnFlex alignItems="center">
              <WorkspaceGridHeader
                previousStateLabels={previousLabels}
                currentState={currentState}
                workspaceName={activeCustomer?.name || ''}
              />
              <UI.Div position="relative">
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

              <UI.Div>
                <HexagonGrid
                  width={width}
                  height={height}
                  backgroundColor={backgroundColor}
                  nodes={hexagonNodes}
                  onHexClick={handleHexClick}
                  stateKey={currentState.currentNode?.id || ''}
                  zoom={zoom}
                />
              </UI.Div>
            </UI.ColumnFlex>
          )}
        </Zoom>
        <UI.Div position="absolute" top="50%" right={24} style={{ transform: 'translateY(-50%)' }}>
          <Layers
            currentState={currentState}
            onClick={(index) => popToIndex(index)}
            historyQueue={historyQueue}
          />
        </UI.Div>
      </UI.Div>

      <UI.Div
        bg="off.100"
        borderBottomLeftRadius={10}
        borderBottomRightRadius={10}
        style={{ boxShadow: 'rgba(0, 0, 0, 0.06) 0px 2px 4px 0px inset' }}
      >
        <UI.PaddedBody>
          <UI.Div mb={4}>
            <UI.Helper>
              Trends
            </UI.Helper>
          </UI.Div>
          <UI.Flex flexWrap="wrap">
            <UI.FadeIn>
              <HealthCard
                score={80}
                responseCount={100}
              />
            </UI.FadeIn>

          </UI.Flex>
        </UI.PaddedBody>
      </UI.Div>
      <Modal.Root open={!!sessionId} onClose={() => setSessionId(undefined)}>
        <InteractionModalCard
          sessionId={sessionId || ''}
        />
      </Modal.Root>
    </LS.WorkspaceGridContainer>
  );
};
