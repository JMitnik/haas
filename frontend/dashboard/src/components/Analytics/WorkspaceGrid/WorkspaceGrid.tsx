import * as UI from '@haas/ui';
import { ArrowLeft } from 'react-feather';
import { GradientLightgreenGreen, GradientPinkRed, GradientSteelPurple } from '@visx/gradient';
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

export const WorkspaceGrid = ({
  initialData,
  backgroundColor,
  onLoadData,
  initialViewMode = HexagonViewMode.Group,
}: WorkspaceGridProps) => {
  const zoomHelper = React.useRef<ProvidedZoom<SVGElement> | null>(null);

  const [stateHistory, setStateHistory] = React.useState<HexagonState[]>([]);
  const [currentState, setCurrentState] = React.useState<HexagonState>({
    currentNode: undefined,
    childNodes: initialData,
    viewMode: initialViewMode,
  });

  const hexSize = 40;
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

  const handleZoomOut = () => {
    if (!zoomHelper.current) return;
    if (isAtMinZoomLevel) return;

    // Empty canvas and unset soom
    zoomHelper.current.reset();
    popQueue();
  };

  return (
    <LS.WorkspaceGridContainer>
      <UI.Grid gridTemplateColumns="2fr 1fr" gridGap="0">
        <UI.Div height="70vh" position="relative">
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
                            {currentState.childNodes?.map((dialogue, index) => (
                              <HexagonItem
                                key={dialogue.id}
                                node={dialogue}
                                top={index * hexSize * 0.9}
                                left={index * hexSize * 1.5}
                                onMouseOver={handleMouseOverHex}
                                onMouseExit={handleMouseOutHex}
                                score={dialogue.score}
                                containerWidth={width}
                                containerHeight={height}
                                hexSize={hexSize}
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
