import * as UI from '@haas/ui';
import { AnimatePresence, AnimateSharedLayout, motion } from 'framer-motion';
import { GradientLightgreenGreen, GradientPinkRed, GradientSteelPurple, LinearGradient } from '@visx/gradient';
import { Group } from '@visx/group';
import { ParentSizeModern } from '@visx/responsive';
import { PatternCircles } from '@visx/pattern';
import { ProvidedZoom } from '@visx/zoom/lib/types';
import { TooltipWithBounds, useTooltip } from '@visx/tooltip';
import { Zoom } from '@visx/zoom';
import { localPoint } from '@visx/event';
import { useModal } from 'react-modal-hook';
import React, { useEffect, useMemo, useState } from 'react';

import { InteractionModalCard } from 'views/InteractionsOverview/InteractionModalCard';
import { Loader } from 'components/Common/Loader/Loader';

import * as LS from './WorkspaceGrid.styles';
import {
  HexagonDialogueNode,
  HexagonGroupNode,
  HexagonNode,
  HexagonNodeType,
  HexagonState,
  HexagonTopicNode,
  HexagonViewMode,
} from './WorkspaceGrid.types';
import { HexagonItem } from './HexagonItem';
import { Layers } from './Layers';
import { TooltipBody } from './TooltipBody';
import { WorkspaceGridPane } from './WorkspaceGridPane';
import { createGrid } from './WorkspaceGrid.helpers';

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
  isLoading?: boolean;
  initialViewMode?: HexagonViewMode;
  onLoadData?: (options: DataLoadOptions) => Promise<[HexagonNode[], HexagonViewMode]>;
}

export const WorkspaceGrid = ({
  initialData,
  backgroundColor,
  onLoadData,
  initialViewMode = HexagonViewMode.Group,
}: WorkspaceGridProps) => {
  const zoomHelper = React.useRef<ProvidedZoom<SVGElement> | null>(null);
  const initialRef = React.useRef<HTMLDivElement>();
  const [stateHistoryStack, setStateHistoryStack] = React.useState<HexagonState[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentState, setCurrentState] = React.useState<HexagonState>({
    currentNode: undefined,
    childNodes: initialData,
    viewMode: initialViewMode,
  });
  const [sessionId, setSessionId] = useState<string | undefined>(undefined);

  const activeDialogue = useMemo(() => {
    const activeNode = stateHistoryStack.find((state) => state.selectedNode?.type === HexagonNodeType.Dialogue);
    return (activeNode?.selectedNode as HexagonDialogueNode)?.dialogue || undefined;
  }, [currentState]);

  const {
    tooltipData,
    tooltipLeft,
    tooltipTop,
    tooltipOpen,
    showTooltip,
    hideTooltip,
  } = useTooltip<HexagonNode>();

  const handleMouseOverHex = (event: React.MouseEvent<SVGPolygonElement, MouseEvent>, node: HexagonNode) => {
    const point = localPoint(event);

    if (!point) return;

    const { x, y } = point;
    showTooltip({
      tooltipData: node,
      tooltipLeft: x,
      tooltipTop: y,
    });
  };

  const [openInteractionModal, closeInteractionModal] = useModal(() => (
    <UI.Modal isOpen onClose={() => setSessionId(undefined)}>
      <InteractionModalCard
        sessionId={sessionId || ''}
        onClose={() => setSessionId(undefined)}
      />
    </UI.Modal>
  ), [sessionId, setSessionId]);

  useEffect(() => {
    if (sessionId) {
      openInteractionModal();
    } else {
      closeInteractionModal();
    }
  }, [sessionId]);

  const handleMouseOutHex = () => hideTooltip();

  const handleZoominLevel = async (currentZoomHelper: ProvidedZoom<SVGElement>, clickedNode: HexagonNode) => {
    hideTooltip();

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

  useEffect(() => {
    hideTooltip();
  }, [currentState.currentNode?.id, hideTooltip]);

  const gridItems = useMemo(() => (
    createGrid(
      currentState?.childNodes?.length || 0,
      initialRef.current?.clientHeight || 495,
      initialRef.current?.clientWidth || 495,
    )
  ), [currentState.childNodes]);

  const hexagonNodes = currentState.childNodes?.map((node, index) => ({
    ...node,
    points: gridItems[index],
  })) || [];

  // ReversedHistory: Session => Dialogue => Group
  const historyQueue = [...stateHistoryStack].reverse();

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
      <UI.Grid gridTemplateColumns="2fr 1fr" gridGap="0">
        <UI.Div borderRadius={20} height="80vh" position="relative">
          <ParentSizeModern>
            {({ width, height }) => (
              <Zoom<SVGElement>
                width={width}
                height={height}
              >
                {(zoom) => {
                  zoomHelper.current = zoom;
                  return (
                    <UI.Div>
                      <svg
                        width={width}
                        height={height}
                        style={{ cursor: zoom.isDragging ? 'grabbing' : 'grab', touchAction: 'none' }}
                        // @ts-ignore
                        ref={zoom.containerRef}
                      >
                        <PatternCircles id="circles" height={6} width={6} stroke="black" strokeWidth={1} />
                        <GradientPinkRed id="dots-pink" />
                        <GradientSteelPurple id="dots-gray" />
                        <LinearGradient id="grays" from="#757F9A" to="#939bb1" />
                        <GradientLightgreenGreen id="dots-green" />
                        <rect width={width} height={height} fill={backgroundColor} stroke={backgroundColor} />
                        <rect
                          width={width}
                          height={height}
                          rx={14}
                          fill="transparent"
                          onTouchStart={zoom.dragStart}
                          onTouchMove={zoom.dragMove}
                          onTouchEnd={zoom.dragEnd}
                          onMouseDown={zoom.dragStart}
                          onMouseMove={zoom.dragMove}
                          onMouseUp={zoom.dragEnd}
                          onMouseLeave={() => {
                            if (zoom.isDragging) zoom.dragEnd();
                          }}
                          onDoubleClick={() => {
                            zoom.scale({ scaleX: 1.1, scaleY: 1.1 });
                          }}
                        />
                        <motion.g
                          initial={{ transform: 'matrix(1, 0, 0, 1, 0, 0', opacity: 0 }}
                          style={{ transform: 'matrix(1, 0, 0, 1, 0, 0' }}
                          animate={{ transform: zoom.toString(), opacity: 1 }}
                        >
                          <Group top={200} left={200}>
                            <AnimatePresence>
                              <motion.g
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                initial={{ opacity: 0 }}
                                key={currentState.currentNode?.id}
                              >
                                {hexagonNodes.map((node) => (
                                  <HexagonItem
                                    key={node.id}
                                    node={node}
                                    points={node.points}
                                    onMouseOver={handleMouseOverHex}
                                    onMouseExit={handleMouseOutHex}
                                    score={node.score}
                                    zoomHelper={zoom}
                                    onZoom={handleZoominLevel}
                                  />
                                ))}
                              </motion.g>
                            </AnimatePresence>

                          </Group>
                        </motion.g>
                      </svg>

                      <AnimateSharedLayout>
                        <AnimatePresence>
                          {tooltipOpen && (
                            <LS.Tooltip
                              key="tooltip"
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              initial={{ opacity: 0, scale: 0.95 }}
                              layoutId="tooltip"
                            >
                              <TooltipWithBounds
                                key={Math.random()}
                                top={tooltipTop}
                                left={tooltipLeft}
                              >
                                {tooltipData && (
                                  <TooltipBody node={tooltipData} />
                                )}
                              </TooltipWithBounds>
                            </LS.Tooltip>
                          )}
                        </AnimatePresence>
                      </AnimateSharedLayout>
                    </UI.Div>
                  );
                }}
              </Zoom>
            )}
          </ParentSizeModern>
        </UI.Div>
        <UI.Div position="absolute" bottom={24} left={24}>
          <Layers currentState={currentState} onClick={(index) => popToIndex(index)} historyQueue={historyQueue} />
        </UI.Div>

        <UI.Div px={2} mt={2}>
          <WorkspaceGridPane currentState={currentState} />
        </UI.Div>
      </UI.Grid>
    </LS.WorkspaceGridContainer>
  );
};
