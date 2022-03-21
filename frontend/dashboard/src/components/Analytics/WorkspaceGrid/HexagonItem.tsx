import { Group } from '@visx/group';
import { Polygon } from '@visx/shape';
import { ProvidedZoom } from '@visx/zoom/lib/types';
import { localPoint } from '@visx/event';
import { motion } from 'framer-motion';
import React, { useState } from 'react';

export type HexagonNode = {
  id: string;
  type: 'Dialogue';
  dialogueId: string;
  impactScore: number;
} | {
  id: string;
  type: 'QuestionNode';
  questionNodeId: string;
  impactScore: number;
};

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
  const initialFill = score > 40 ? 'url(#dots-green)' : 'url(#dots-pink)';
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
