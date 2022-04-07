import { ProvidedZoom } from '@visx/zoom/lib/types';
import React, { useState } from 'react';

import { HexagonNode } from './WorkspaceGrid.types';
import { getHexagonSVGFill } from './WorkspaceGrid.helpers';

interface HexagonItemProps {
  node: HexagonNode;
  zoomHelper: ProvidedZoom<SVGElement>;
  points: string;
  score: number;
  onZoom: (zoomHelper: ProvidedZoom<SVGElement>, node: HexagonNode) => void;
  onMouseOver: (event: React.MouseEvent<SVGPolygonElement, MouseEvent>, node: HexagonNode) => void;
  onMouseExit?: () => void;
}

export const HexagonItem = ({
  node,
  zoomHelper,
  points,
  score,
  onZoom,
  onMouseOver,
  onMouseExit,
}: HexagonItemProps) => {
  const initialFill = getHexagonSVGFill(score);
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
