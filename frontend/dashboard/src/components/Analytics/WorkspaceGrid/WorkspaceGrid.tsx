import * as UI from '@haas/ui';
import { ArrowLeft, PieChart } from 'react-feather';
import { GradientLightgreenGreen, GradientPinkRed } from '@visx/gradient';
import { Group } from '@visx/group';
import { PatternCircles } from '@visx/pattern';
import { ProvidedZoom } from '@visx/zoom/lib/types';
import { TooltipWithBounds, useTooltip } from '@visx/tooltip';
import { Zoom } from '@visx/zoom';
import { localPoint } from '@visx/event';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import React, { useEffect } from 'react';

import { DialogueStatisticsSummaryModel } from 'types/generated-types';

import * as LS from './WorkspaceGrid.styles';
import { HexagonItem, HexagonNode } from './HexagonItem';
import { TooltipBody } from './TooltipBody';

interface Dialogue {
  id: string;
  dialogueStatisticsSummary?: DialogueStatisticsSummaryModel | null;
}

export interface WorkspaceGridProps {
  data_L0: Dialogue[];
  data_L1?: any[];
  data_L2?: any[];
  width: number;
  height: number;
  backgroundColor: string;
}
export const WorkspaceGrid = ({ data_L0, data_L1, data_L2, width, height, backgroundColor }: WorkspaceGridProps) => {
  const { t } = useTranslation();
  const zoomHelper = React.useRef<ProvidedZoom<SVGElement> | null>(null);
  const [zoomLevel, setZoomLevel] = React.useState(0);
  const [dataItems, setDataItems] = React.useState(data_L0);
  const [activeDialogue, setActiveDialogue] = React.useState<any>();

  const hexSize = 40;
  const maxZoomLevel = 1;
  const minZoomLevel = 0;
  const isAtMaxZoomLevel = zoomLevel === maxZoomLevel;
  const isAtMinZoomLevel = zoomLevel === minZoomLevel;

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

  const zoomToData: Record<number, any[]> = React.useMemo(() => ({
    0: data_L0,
    1: data_L1 || [],
    // 2: data_L2 || [],
  }), [data_L0, data_L1, data_L2]);

  const handleZoominLevel = (currentZoomHelper: ProvidedZoom<SVGElement>, node: HexagonNode) => {
    if (isAtMaxZoomLevel) return;

    // Empty canvas and unset soom
    setDataItems([]);
    currentZoomHelper.reset();

    if (node?.type === 'Dialogue') {
      setActiveDialogue(node);
    }

    setZoomLevel((currentZoomLevel) => currentZoomLevel + 1);
  };

  const handleZoomOut = () => {
    if (!zoomHelper.current) return;
    if (isAtMinZoomLevel) return;

    // Empty canvas and unset soom
    setDataItems([]);
    setActiveDialogue(undefined);
    zoomHelper.current.reset();
    setZoomLevel((currentZoomLevel) => currentZoomLevel - 1);
  };

  useEffect(() => {
    const newData = zoomToData[zoomLevel];
    setDataItems(newData);
  }, [zoomLevel, zoomToData, setDataItems]);

  console.log({ activeDialogue });

  return (
    <LS.WorkspaceGridContainer>
      <UI.Grid gridTemplateColumns="900px 1fr">
        <UI.Div position="relative">
          <LS.GridControls>
            {!isAtMinZoomLevel && (
              <LS.IconButton onClick={() => handleZoomOut()}>
                <UI.Icon>
                  <ArrowLeft />
                </UI.Icon>
              </LS.IconButton>
            )}
          </LS.GridControls>
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
                            id={dialogue.id}
                            top={index * hexSize * 0.9}
                            left={index * hexSize * 1.5}
                            onMouseOver={handleMouseOverHex}
                            onMouseExit={handleMouseOutHex}
                            score={dialogue?.dialogueStatisticsSummary?.impactScore || 0}
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
            // set this to random so it correctly updates with parent bounds
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
        </UI.Div>

        <UI.Div>
          {activeDialogue && (
            <LS.DetailsPane m={4}>
              <UI.Text fontSize="1.1rem" color="blue.800" fontWeight={600}>
                Insights
              </UI.Text>
              <UI.Muted fontWeight={800} style={{ fontWeight: 500 }}>
                Understand your flow and how it impacts your conversations.
              </UI.Muted>

              <UI.Div mt={4}>
                <UI.Helper>{t('dialogue')}</UI.Helper>
                <UI.Span fontWeight={500}>
                  {activeDialogue.title}
                </UI.Span>
              </UI.Div>

              <UI.Div mt={4}>
                <UI.Helper>{t('statistics')}</UI.Helper>
                <UI.Span fontWeight={500}>
                  <UI.Icon stroke="gray.300" mr={1}>
                    <PieChart />
                  </UI.Icon>
                  {activeDialogue.dialogueStatisticsSummary?.impactScore.toFixed(2)}
                </UI.Span>
              </UI.Div>
            </LS.DetailsPane>
          )}
        </UI.Div>
      </UI.Grid>
    </LS.WorkspaceGridContainer>
  );
};
