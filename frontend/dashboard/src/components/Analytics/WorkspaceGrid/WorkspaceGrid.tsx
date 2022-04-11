import * as UI from '@haas/ui';
import { AnimatePresence, AnimateSharedLayout, motion } from 'framer-motion';
import { ChevronRight } from 'react-feather';
import { GradientLightgreenGreen, GradientPinkRed, GradientSteelPurple } from '@visx/gradient';
import { Grid, Hex, createHexPrototype, rectangle } from 'honeycomb-grid';
import { Group } from '@visx/group';
import { ParentSizeModern } from '@visx/responsive';
import { PatternCircles } from '@visx/pattern';
import { ProvidedZoom } from '@visx/zoom/lib/types';
import { TooltipWithBounds, useTooltip } from '@visx/tooltip';
import { Zoom } from '@visx/zoom';
import { localPoint } from '@visx/event';
import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';

import { useFormatter } from 'hooks/useFormatter';

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
import { TooltipBody } from './TooltipBody';
import { WorkspaceGridPane } from './WorkspaceGridPane';

const Tooltip = motion.custom(styled.div`
  > * {
    padding: 0 !important;
    border-radius: 20px !important;
  }
`);

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

const createGrid = (nrItems: number, windowHeight: number, windowWidth: number) => {
  const gridItems: any[] = [];
  const squareRoot = Math.sqrt(nrItems);
  const ratioWindow = windowWidth / windowHeight;
  const itemsPerRow = Math.ceil(squareRoot * ratioWindow) || 1;
  const itemsPerColumn = Math.ceil(squareRoot) || 1;
  const dimensions = Math.floor((windowWidth / itemsPerRow) / 2);

  const hexPrototype = createHexPrototype({
    dimensions,
    offset: 1,
  });

  new Grid(hexPrototype, rectangle({ start: [0, 0], width: itemsPerRow, height: itemsPerColumn }))
    .each((hex: Hex) => {
      const corners = hex.corners.map(({ x, y }) => `${x},${y}`);
      gridItems.push(corners.join(' '));
    }).run();

  return gridItems;
};

const getLabelFill = (score?: number) => {
  if (!score) return '#4b1c54';
  if (score >= 40) return '#34aea3';
  return '#fb5a66';
};

const getLabelColor = (score?: number) => {
  if (!score) return '#f9ecff';
  if (score >= 40) return '#deffde';
  return 'white';
};

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
  const { formatScore } = useFormatter();

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

  const handleMouseOutHex = () => hideTooltip();

  const handleZoominLevel = async (currentZoomHelper: ProvidedZoom<SVGElement>, clickedNode: HexagonNode) => {
    if (
      currentState.viewMode === HexagonViewMode.Final
      || currentState.viewMode === HexagonViewMode.Session) return;
    hideTooltip();

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
      <UI.Grid gridTemplateColumns="2fr 1fr" gridGap="0">
        <UI.Div borderRadius={10} height="60vh" position="relative">
          {stateHistoryStack.length > 0 && (
            <LS.BreadCrumbContainer
              display="inline-block"
              my={1}
              border="1px solid"
              borderColor="gray.100"
              borderRadius={12}
              pl={2}
              pr={2}
              py={1}
            >
              <UI.Stack alignItems="center" isInline>
                <UI.Flex alignItems="center">
                  <UI.Label
                    color="black"
                    bg="white"
                    onClick={() => { popToIndex(0); }}
                    style={{ cursor: 'pointer' }}
                  >
                    <UI.Span ml={1}>
                      Home
                    </UI.Span>
                  </UI.Label>
                  {historyQueue.map((state, index) => (
                    <React.Fragment key={index}>
                      <UI.Icon
                        bg="gray.200"
                        color="gray.500"
                        width="1.2rem"
                        height="1.2rem"
                        fontSize="0.9rem"
                        mx={1}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: '100%',
                        }}
                      >
                        <ChevronRight />
                      </UI.Icon>
                      <UI.Flex>
                        <UI.Label
                          color={getLabelColor(state?.selectedNode?.score || 0)}
                          bg={getLabelFill(state?.selectedNode?.score)}
                          key={index}
                          onClick={() => { popToIndex(index + 1); }}
                          style={{ cursor: 'pointer' }}
                        >
                          <UI.Span>
                            {formatScore(state.selectedNode?.score)}
                          </UI.Span>
                          {' '}
                          {/* <SingleHexagon fill={getHexagonFill(state.selectedNode?.score)} /> */}
                          <UI.Span ml={1}>
                            {state.selectedNode?.type === HexagonNodeType.Group && (
                              <>
                                {state.selectedNode.label}
                              </>
                            )}
                            {state.selectedNode?.type === HexagonNodeType.Dialogue && (
                              <>
                                {state.selectedNode.label}
                              </>
                            )}
                            {state.selectedNode?.type === HexagonNodeType.Topic && (
                              <>
                                {state.selectedNode.topic.name}
                              </>
                            )}
                            {state.selectedNode?.type === HexagonNodeType.Session && (
                              <>
                                {state.selectedNode.session.id}
                              </>
                            )}
                          </UI.Span>
                        </UI.Label>
                      </UI.Flex>
                    </React.Fragment>
                  ))}
                </UI.Flex>
              </UI.Stack>
            </LS.BreadCrumbContainer>
          )}
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
                          background: 'rgba(0, 0, 0, 0.12)',
                        }}
                      >
                        loading
                      </motion.div>
                      )}
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
                        <GradientLightgreenGreen id="dots-green" />
                        <rect width={width} height={height} fill="#f7f7f7" stroke={backgroundColor} />
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
                            <Tooltip
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              initial={{ opacity: 0 }}
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
                            </Tooltip>
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

        <UI.Div px={2} mt={2}>
          <WorkspaceGridPane currentState={currentState} />
        </UI.Div>
      </UI.Grid>
    </LS.WorkspaceGridContainer>
  );
};
