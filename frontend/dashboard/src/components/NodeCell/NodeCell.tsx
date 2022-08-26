import * as UI from '@haas/ui';
import React from 'react';

import { MapNodeToProperties } from 'components/MapNodeToProperties';
import { NodeCellContainer } from './NodeCellTypes';

interface NodeCellProps {
  node: any;
  onClick?: () => void;
  onRemove: () => void;
}

export const NodeCell = ({ node, onClick, onRemove }: NodeCellProps) => {
  console.log('CTA CELL: ', node);
  if (!node.type) return null;
  const nodeProps = MapNodeToProperties(node.type);

  const removeCTAFromOption = (e: any) => {
    e.stopPropagation();
    onRemove();
  };

  return (
    <NodeCellContainer onClick={onClick} style={{ padding: '8px 12px', width: '100%', position: 'relative' }}>
      <UI.CloseButton onClose={removeCTAFromOption} top="5px" right="5px" />
      <UI.Flex width="100%">
        <UI.Icon
          bg={nodeProps.bg}
          color={nodeProps.color}
          height="2rem"
          width="2rem"
          stroke={nodeProps.stroke || undefined}
          style={{ flexShrink: 0 }}
          mr={3}
        >
          <nodeProps.icon />
        </UI.Icon>
        <UI.Div>
          <UI.Text paddingRight={2}>
            {node.label}
          </UI.Text>
          <UI.MicroLabel
            bg={nodeProps.bg}
            color={nodeProps.color !== 'transparent' ? nodeProps.color : nodeProps.stroke}
          >
            {node.type?.replaceAll('_', ' ')}
          </UI.MicroLabel>
        </UI.Div>
      </UI.Flex>
    </NodeCellContainer>
  );
};
