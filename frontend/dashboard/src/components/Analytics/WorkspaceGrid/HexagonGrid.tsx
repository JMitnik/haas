import * as UI from '@haas/ui';
import { AnimatePresence, AnimateSharedLayout, motion } from 'framer-motion';
import { GradientLightgreenGreen, GradientPinkRed, GradientSteelPurple, LinearGradient } from '@visx/gradient';
import { Group } from '@visx/group';
import { PatternCircles } from '@visx/pattern';
import { ProvidedZoom } from '@visx/zoom/lib/types';
import useMeasure from 'react-use-measure';

import { TooltipWithBounds, useTooltip } from '@visx/tooltip';
import { localPoint } from '@visx/event';

import React, { useEffect } from 'react';

import * as LS from './WorkspaceGrid.styles';
import { HexagonItem } from './HexagonItem';
import { HexagonNode } from './WorkspaceGrid.types';
import { TooltipBody } from './TooltipBody';

interface HexagonGridProps {
  x: number;
  y: number;
  stateKey: string;
  nodes: HexagonNode[];
  onHexClick: (zoomHelper: ProvidedZoom<SVGElement>, node: HexagonNode) => void;
  width: number;
  height: number;
  zoom: ProvidedZoom<SVGElement>;
  backgroundColor: string;
}

export const HexagonGrid = ({
  stateKey,
  onHexClick,
  nodes,
  width,
  height,
  zoom,
  backgroundColor,
}: HexagonGridProps) => {
  const [ref, bounds] = useMeasure({
    debounce: {
      resize: 2,
      scroll: 1,
    },
  });

  const {
    tooltipData,
    tooltipLeft,
    tooltipTop,
    tooltipOpen,
    showTooltip,
    hideTooltip,
  } = useTooltip<HexagonNode>();

  /**
   * Shows the tooltip for a hexagon.
   */
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

  return (
    <UI.Div position="relative" data-test-id="HexagonGrid" width={width} height={height}>
      <svg
        width={width}
        height={height}
        // @ts-ignore
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
            // @ts-ignore
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
          <Group top={130} left={130}>
            <motion.g
              ref={ref}
              x={-10 + (width - bounds.width) / 2}
              y={(height - bounds.height) / 2}
            >

              <AnimatePresence>
                <motion.g
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  initial={{ opacity: 0 }}
                  key={stateKey}
                >
                  <Group id="items">
                    {nodes.map((node) => (
                      <HexagonItem
                        strokeWidth={5}
                        key={node.id}
                        node={node}
                        points={node.points as string}
                        onMouseOver={handleMouseOverHex}
                        onMouseExit={handleMouseOutHex}
                        score={node.score}
                        zoomHelper={zoom}
                        onZoom={() => {
                          hideTooltip();
                          onHexClick(zoom, node);
                        }}
                      />
                    ))}
                  </Group>
                </motion.g>
              </AnimatePresence>
            </motion.g>
          </Group>
        </motion.g>
      </svg>

      <AnimateSharedLayout>
        <AnimatePresence>
          {tooltipOpen && (
            <LS.Tooltip
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
};
