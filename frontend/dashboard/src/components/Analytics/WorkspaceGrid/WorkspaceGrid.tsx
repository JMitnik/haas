import * as UI from '@haas/ui';
import { ArrowLeft, PieChart, Users } from 'react-feather';
import { GradientLightgreenGreen, GradientPinkRed, GradientSteelPurple } from '@visx/gradient';
import { Group } from '@visx/group';
import { ParentSizeModern } from '@visx/responsive';
import { PatternCircles } from '@visx/pattern';
import { ProvidedZoom } from '@visx/zoom/lib/types';
import { TooltipWithBounds, useTooltip } from '@visx/tooltip';
import { Zoom } from '@visx/zoom';
import { localPoint } from '@visx/event';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import React from 'react';

import { useFormatter } from 'hooks/useFormatter';

import * as LS from './WorkspaceGrid.styles';
import { HexagonItem } from './HexagonItem';
import { HexagonNode, HexagonNodeType, HexagonState } from './WorkspaceGrid.types';
import { TooltipBody } from './TooltipBody';

export interface DataLoadOptions {
  dialogueId: string;
  topic: string;
  topics: string[];
}

export interface WorkspaceGridProps {
  initialData: HexagonNode[];
  onLoadData?: (options: DataLoadOptions) => Promise<HexagonNode[]>;
  width: number;
  height: number;
  backgroundColor: string;
}
export const WorkspaceGrid = ({ initialData, backgroundColor, onLoadData }: WorkspaceGridProps) => {
  const { t } = useTranslation();
  const zoomHelper = React.useRef<ProvidedZoom<SVGElement> | null>(null);
  const [prevNodes, setPrevNodes] = React.useState<HexagonState[]>([]);
  const [dataItems, setDataItems] = React.useState(initialData);
  const [activeDialogue, setActiveDialogue] = React.useState<HexagonNode>();
  const { formatScore } = useFormatter();
  const topics = prevNodes.map(({ parentNode }) => parentNode.topic).filter((val) => !!val);

  const hexSize = 40;
  const isAtMinZoomLevel = prevNodes.length === 0;

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

  const handleZoominLevel = async (currentZoomHelper: ProvidedZoom<SVGElement>, node: HexagonNode) => {
    // Empty canvas and unset soom
    currentZoomHelper.reset();

    if (node.type === HexagonNodeType.Dialogue) {
      setActiveDialogue(node);
    }

    const dialogueId = node.type === HexagonNodeType.Dialogue ? node.id : activeDialogue?.id;
    if (!dialogueId || !onLoadData) return;

    const newNodes = await onLoadData({
      dialogueId,
      topic: node.type === HexagonNodeType.QuestionNode ? node.topic : '',
      topics,
    });

    setPrevNodes((nodesArray) => ([{ parentNode: node, childNodes: newNodes }, ...nodesArray]));
    setDataItems(newNodes);
  };

  const popQueue = () => {
    if (!prevNodes.length) return;

    console.log({ prevNodes });
    setDataItems(prevNodes?.[0].childNodes);
    setPrevNodes((currentPrevNodes) => {
      if (currentPrevNodes.length === 1) return [];

      const [, ...rest] = currentPrevNodes;
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
                            {dataItems?.map((dialogue, index) => (
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

        <UI.Div bg="white" borderLeft="1px solid" borderLeftColor="gray.200">
          {activeDialogue && activeDialogue.type === HexagonNodeType.Dialogue && (
            <LS.DetailsPane
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
              m={4}
            >
              <UI.Text fontSize="1.1rem" color="blue.800" fontWeight={600}>
                Insights
              </UI.Text>
              <UI.Muted fontWeight={800} style={{ fontWeight: 500 }}>
                Understand your flow and how it impacts your conversations.
              </UI.Muted>

              <UI.Div mt={4}>
                <UI.Helper>{t('dialogue')}</UI.Helper>
                <UI.Span fontWeight={500}>
                  {activeDialogue.dialogue.title}
                </UI.Span>
              </UI.Div>

              <UI.Div mt={4}>
                <UI.Helper>{t('statistics')}</UI.Helper>
                <UI.Div mt={1}>
                  <UI.Icon stroke="#7a228a" mr={1}>
                    <PieChart />
                  </UI.Icon>
                  {formatScore(activeDialogue.score)}
                </UI.Div>

                <UI.Div mt={1}>
                  <UI.Span fontWeight={500}>
                    <UI.Icon stroke="#f1368a" mr={1}>
                      <Users />
                    </UI.Icon>
                    {activeDialogue.dialogue.dialogueStatisticsSummary?.nrVotes}
                  </UI.Span>
                </UI.Div>
              </UI.Div>
            </LS.DetailsPane>
          )}

          {!activeDialogue && (
            <UI.ColumnFlex height="100%" justifyContent="center" alignItems="center">
              <UI.Text fontSize="1.2rem" color="gray.500" fontWeight={300}>
                Select a dialogue for more insights.
              </UI.Text>
            </UI.ColumnFlex>
          )}
        </UI.Div>
      </UI.Grid>
    </LS.WorkspaceGridContainer>
  );
};
