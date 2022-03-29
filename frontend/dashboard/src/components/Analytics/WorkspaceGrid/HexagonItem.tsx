import { ProvidedZoom } from '@visx/zoom/lib/types';
import React, { useState } from 'react';

import { HexagonNode } from './WorkspaceGrid.types';

interface HexagonItemProps {
  node: HexagonNode;
  zoomHelper: ProvidedZoom<SVGElement>;
  points: string;
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
  points,
  score,
  onZoom,
  onMouseOver,
  onMouseExit,
}: HexagonItemProps) => {
  const initialFill = getHexagonFill(score);
  const [fill] = useState(initialFill);

  return (
    <g>
      <g fill="blue">
        <polygon
          points={points}
          fill={fill}
          onMouseOver={(event) => {
            onMouseOver?.(event, node);
          }}
          onMouseOut={() => onMouseExit?.()}
          onClick={() => onZoom(zoomHelper, node)}
        />
      </g>
    </g>
  );
};
