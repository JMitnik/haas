import { ProvidedZoom } from '@visx/zoom/lib/types';
import React, { useState } from 'react';

import { HexagonNode } from './WorkspaceGrid.types';
import { getHexagonSVGFill } from './WorkspaceGrid.helpers';

interface HexagonItemProps {
  node: HexagonNode;
  zoomHelper: ProvidedZoom<SVGElement>;
  points: string;
  score: number;
  strokeWidth: number;
  onZoom: (zoomHelper: ProvidedZoom<SVGElement>, node: HexagonNode) => void;
  onMouseOver: (event: React.MouseEvent<SVGPolygonElement, MouseEvent>, node: HexagonNode) => void;
  onMouseExit?: () => void;
  id?: string;
}

export const HexagonItem = ({
  node,
  zoomHelper,
  points,
  score,
  onZoom,
  onMouseOver,
  onMouseExit,
  strokeWidth,
}: HexagonItemProps) => {
  const initialFill = getHexagonSVGFill(score);
  const [fill] = useState(initialFill);

  return (
    <g>
      <g fill="blue">
        <polygon
          aria-label={node.id}
          strokeWidth={strokeWidth}
          points={points}
          stroke="white"
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
