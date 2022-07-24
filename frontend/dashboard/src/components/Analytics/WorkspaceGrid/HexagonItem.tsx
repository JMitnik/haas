import { ProvidedZoom } from '@visx/zoom/lib/types';
import React from 'react';

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

  return (
    <g>
      <g fill="blue">
        <polygon
          aria-label={node.id}
          role="button"
          strokeWidth={strokeWidth}
          points={points}
          stroke="white"
          fill={initialFill}
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
