import { Group } from '@visx/group';
import { Polygon } from '@visx/shape';
import { ProvidedZoom } from '@visx/zoom/lib/types';
import { localPoint } from '@visx/event';
import { motion } from 'framer-motion';
import React, { useState } from 'react';

import { HexagonNode } from './WorkspaceGrid.types';

interface HexagonItemProps {
  node: HexagonNode;
  zoomHelper: ProvidedZoom<SVGElement>;
  containerWidth: number;
  containerHeight: number;
  containerBackgroundFill: string;
  top: number;
  left: number;
  hexSize: number;
  score: number;
  onZoom: (zoomHelper: ProvidedZoom<SVGElement>, node: HexagonNode) => void;
  onMouseOver: (event: React.MouseEvent<SVGPolygonElement, MouseEvent>, node: HexagonNode) => void;
  onMouseExit?: () => void;
}

const getHexagonFill = (score?: number) => {
  if (!score) return 'url(#dots-gray)';
  if (score >= 40) return 'url(#dots-green)';
  return 'url(#dots-pink)';
};

export const HexagonItem = ({
  node,
  zoomHelper,
  containerWidth,
  containerHeight,
  top,
  left,
  hexSize = 40,
  score,
  onZoom,
  onMouseOver,
  onMouseExit,
  containerBackgroundFill,
}: HexagonItemProps) => {
  const initialFill = getHexagonFill(score);
  const [fill, setFill] = useState(initialFill);

  const handleZoom = (event: React.MouseEvent<SVGPolygonElement, MouseEvent>) => {
    const localPointFound = localPoint(event) || { x: 0, y: 0 };
    const scaleX = containerWidth / 40;
    const scaleY = containerHeight / 40;
    zoomHelper.scale({ scaleX, scaleY, point: localPointFound });

    setTimeout(() => {
      setFill(containerBackgroundFill);
      setTimeout(() => {
        onZoom(zoomHelper, node);
      }, 250);
    }, 500);
  };

  return (
    <Group top={top} left={left}>
      <motion.g animate={{ opacity: 1 }} initial={{ opacity: 0 }} exit={{ opacity: 0 }}>
        <g fill="blue">
          <Polygon
            sides={6}
            size={hexSize}
            fill={fill}
            onMouseOver={(event) => {
              onMouseOver?.(event, node);
            }}
            onMouseOut={() => onMouseExit?.()}
            onClick={(e) => handleZoom(e)}
          />
        </g>
      </motion.g>
    </Group>
  );
};
