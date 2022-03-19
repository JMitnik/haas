import { Group } from '@visx/group';
import { Polygon } from '@visx/shape';
import React from 'react';
import { useState } from 'react';
import { localPoint } from '@visx/event';
import { motion } from 'framer-motion';

export const HexagonItem = ({ zoom, containerWidth, containerHeight, top, left, hexSize, score, onZoom }: any) => {
  const initialFill = score > 40 ? '#77ef9c' : '#f3595e'
  const [fill, setFill] = useState(initialFill);

  const handleZoom = () => {
    setTimeout(() => {
      setFill('#e9eff5');
      onZoom(zoom);
    }, 500);
  }

  return (
    <Group top={top} left={left}>
      <motion.g animate={{ opacity: 1 }} initial={{ opacity: 0 }} exit={{ opacity: 0 }}>
        <Polygon
          sides={6}
          size={hexSize}
          fill={fill}
          onClick={(e) => {
            if (e) {
              // @ts-ignore
              const localPointFound = localPoint(e)

              const scaleX = containerWidth / 40;
              const scaleY = containerHeight / 40;

              if (localPointFound) {
                zoom.scale({ scaleX: scaleX, scaleY: scaleY, point: localPointFound });
                handleZoom();
              }
            }
          }}
        />
      </motion.g>
    </Group>
  )
}
