import * as UI from '@haas/ui';
import { ArrowLeft } from 'react-feather';
import { GradientLightgreenGreen, GradientPinkRed, GradientSteelPurple } from '@visx/gradient';
import { Grid, Hex, createHexPrototype, rectangle } from 'honeycomb-grid';

import { AnimatePresence, motion } from 'framer-motion';
import { Group } from '@visx/group';
import { ParentSizeModern } from '@visx/responsive';
import { PatternCircles } from '@visx/pattern';
import { ProvidedZoom } from '@visx/zoom/lib/types';
import { TooltipWithBounds, useTooltip } from '@visx/tooltip';
import { Zoom } from '@visx/zoom';
import { localPoint } from '@visx/event';
import React, { useEffect, useMemo, useState } from 'react';

import * as LS from './WorkspaceGrid.styles';

import {
  HexagonDialogueNode,
  HexagonNode,
  HexagonNodeType,
  HexagonQuestionNodeNode,
  HexagonState,
  HexagonViewMode,
} from './WorkspaceGrid.types';
import { HexagonItem } from './HexagonItem';
import { TooltipBody } from './TooltipBody';
import { WorkspaceGridPane } from './WorkspaceGridPane';

export interface DataLoadOptions {
  dialogueId: string;
  topic: string;
  topics: string[];
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

export const WorkspaceGrid = ({
  initialData,
  backgroundColor,
  onLoadData,
  initialViewMode = HexagonViewMode.Group,
}: WorkspaceGridProps) => {
  const zoomHelper = React.useRef<ProvidedZoom<SVGElement> | null>(null);
  const initialRef = React.useRef<HTMLDivElement>();
  const [stateHistory, setStateHistory] = React.useState<HexagonState[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentState, setCurrentState] = React.useState<HexagonState>({
    currentNode: undefined,
    childNodes: initialData,
    viewMode: initialViewMode,
  });

  const isAtMinZoomLevel = stateHistory.length === 0;

  const activeDialogue = useMemo(() => {
    const activeNode = stateHistory.find((state) => state.selectedNode?.type === HexagonNodeType.Dialogue);
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
    }, ...stateHistory];
    setStateHistory(newStateHistory);

    const topics = newStateHistory
      .filter((state) => state.selectedNode?.type === HexagonNodeType.QuestionNode)
      .map((state) => (state.selectedNode as HexagonQuestionNodeNode)?.topic);

    const dialogueId = clickedNode.type === HexagonNodeType.Dialogue ? clickedNode.id : activeDialogue?.id;
    if (!dialogueId || !onLoadData) return;
    setIsLoading(true);

    const [newNodes, hexagonViewMode] = await onLoadData({
      dialogueId,
      topic: clickedNode.type === HexagonNodeType.QuestionNode ? clickedNode.topic : '',
      topics,
    }).finally(() => setIsLoading(false));

    setCurrentState({ currentNode: clickedNode, childNodes: newNodes, viewMode: hexagonViewMode });
  };

  useEffect(() => {
    hideTooltip();
  }, [currentState.currentNode?.id, hideTooltip]);

  const popQueue = () => {
    if (!stateHistory.length) return;

    const latestState = stateHistory[0];
    setCurrentState(latestState);
    setStateHistory((currentHistory) => {
      if (currentHistory.length === 1) return [];

      const [, ...rest] = currentHistory;
      return rest;
    });
  };

  const gridItems = useMemo(() => (
    createGrid(
      currentState?.childNodes?.length || 0,
      initialRef.current?.clientHeight || 495,
      initialRef.current?.clientWidth || 495,
    )
  ), [currentState.childNodes]);

  const handleZoomOut = () => {
    if (!zoomHelper.current) return;
    if (isAtMinZoomLevel) return;
    hideTooltip();

    // Empty canvas and unset soom
    // zoomHelper.current.reset();
    popQueue();
  };

  const hexagonNodes = currentState.childNodes?.map((node, index) => ({
    ...node,
    points: gridItems[index],
  })) || [];

  return (
    <LS.WorkspaceGridContainer>
      <AnimatePresence />
      <UI.Grid gridTemplateColumns="2fr 1fr" gridGap="0">
        <UI.Div ref={initialRef} height="70vh" position="relative">
          <LS.GridControls>
            {!isAtMinZoomLevel && (
              <LS.IconButton onClick={() => handleZoomOut()}>
                <UI.Icon>
                  <ArrowLeft />
                </UI.Icon>
              </LS.IconButton>
            )}
          </LS.GridControls>
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
                        <rect width={width} height={height} fill={backgroundColor} />
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
                          <Group top={100} left={100}>
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

                      {tooltipOpen && (
                        <TooltipWithBounds
                          key={Math.random()}
                          top={tooltipTop}
                          left={tooltipLeft}
                        >
                          {tooltipData && (
                            <TooltipBody node={tooltipData} />
                          )}
                        </TooltipWithBounds>
                      )}
                    </UI.Div>
                  );
                }}
              </Zoom>
            )}
          </ParentSizeModern>
        </UI.Div>

        <WorkspaceGridPane stateHistory={stateHistory} />
      </UI.Grid>
    </LS.WorkspaceGridContainer>
  );
};
