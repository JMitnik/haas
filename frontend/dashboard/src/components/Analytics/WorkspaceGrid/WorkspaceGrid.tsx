import * as UI from '@haas/ui';
import { ArrowLeft } from 'react-feather';
import { GradientLightgreenGreen, GradientPinkRed, GradientSteelPurple } from '@visx/gradient';
import { Grid, Hex, createHexPrototype, rectangle } from 'honeycomb-grid';

import { Group } from '@visx/group';
import { ParentSizeModern } from '@visx/responsive';
import { PatternCircles } from '@visx/pattern';
import { ProvidedZoom } from '@visx/zoom/lib/types';
import { TooltipWithBounds, useTooltip } from '@visx/tooltip';
import { Zoom } from '@visx/zoom';
import { localPoint } from '@visx/event';
import { motion } from 'framer-motion';
import React, { useMemo } from 'react';

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
  initialViewMode?: HexagonViewMode;
  onLoadData?: (options: DataLoadOptions) => Promise<[HexagonNode[], HexagonViewMode]>;
}

const calcHexagonWidth = (nrItems: number) => {
  if (nrItems < 100) {
    return 30;
  } if (nrItems >= 100 && nrItems < 500) {
    return 15;
  } if (nrItems >= 500 && nrItems < 1000) {
    return 5;
  }
  return 0;
};

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

    // Empty canvas and unset soom
    currentZoomHelper.reset();
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

    const [newNodes, hexagonViewMode] = await onLoadData({
      dialogueId,
      topic: clickedNode.type === HexagonNodeType.QuestionNode ? clickedNode.topic : '',
      topics,
    });

    setCurrentState({ currentNode: clickedNode, childNodes: newNodes, viewMode: hexagonViewMode });
  };

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

    // Empty canvas and unset soom
    zoomHelper.current.reset();
    popQueue();
  };

  const hexagonNodes = currentState.childNodes?.map((node, index) => ({
    ...node,
    points: gridItems[index],
  })) || [];

  return (
    <LS.WorkspaceGridContainer>
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
                            {hexagonNodes.map((node) => (
                              <HexagonItem
                                key={node.id}
                                node={node}
                                points={node.points}
                                onMouseOver={handleMouseOverHex}
                                onMouseExit={handleMouseOutHex}
                                score={node.score}
                                containerWidth={width}
                                containerHeight={height}
                                zoomHelper={zoom}
                                onZoom={handleZoominLevel}
                                containerBackgroundFill={backgroundColor}
                              />
                            ))}
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
