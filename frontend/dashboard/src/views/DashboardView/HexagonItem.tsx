import { Group } from '@visx/group';
import { Polygon } from '@visx/shape';
import React from 'react';
import { useState } from 'react';
import { localPoint } from '@visx/event';
import { motion } from 'framer-motion';
import { ProvidedZoom } from '@visx/zoom/lib/types';

interface HexagonItemProps {
  zoomHelper: ProvidedZoom<SVGElement>;
  containerWidth: number;
  containerHeight: number;
  top: number;
  left: number;
  hexSize: number;
  score: number;
  onZoom: (zoomHelper: ProvidedZoom<SVGElement>) => void;
}

export const HexagonItem = ({
  zoomHelper,
  containerWidth,
  containerHeight,
  top,
  left,
  hexSize,
  score,
  onZoom
}: HexagonItemProps) => {
  const initialFill = score > 40 ? '#77ef9c' : '#f3595e'
  const [fill, setFill] = useState(initialFill);

  const handleZoom = (event: React.MouseEvent<SVGPolygonElement, MouseEvent>) => {
    const localPointFound = localPoint(event);
    const scaleX = containerWidth / 40;
    const scaleY = containerHeight / 40;

    if (localPointFound) {
      zoomHelper.scale({ scaleX: scaleX, scaleY: scaleY, point: localPointFound });
    }
    setTimeout(() => {
      setFill('#e9eff5');
      setTimeout(() => {
        onZoom(zoomHelper);
      }, 250);
    }, 500);
  }

  return (
    <Group top={top} left={left}>
      <motion.g animate={{ opacity: 1 }} initial={{ opacity: 0 }} exit={{ opacity: 0 }}>
        <g fill="blue">
          <Polygon
            sides={6}
            size={hexSize}
            fill={fill}
            onClick={(e) => handleZoom(e)}
          />
        </g>
      </motion.g>
    </Group>
  )
}
