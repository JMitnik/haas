import * as UI from '@haas/ui';
import { Frown } from 'react-feather';
import { useTheme } from 'styled-components';
import React from 'react';

import { NodeCellContainer } from './PreNodeFormCell.types';

interface NodeCellProps {
  node: any;
  onClick?: () => void;
  onRemove: () => void;
}

export const PreNodeFormCell = ({ node, onClick, onRemove }: NodeCellProps) => {
  if (!node.header) return null;
  const theme = useTheme();

  const removePreNodeForm = (e: any) => {
    e.stopPropagation();
    onRemove();
  };

  return (
    <NodeCellContainer
      aria-label="PreNodeFormCell"
      noFill
      onClick={onClick}
      style={{ padding: '8px 12px', width: '100%', position: 'relative' }}
    >
      <UI.CloseButton onClose={removePreNodeForm} top="5px" right="5px" />
      <UI.Flex width="100%">
        <UI.Icon
          bg={theme.colors.main['500']}
          color={theme.colors.white}
          stroke="main.400"
          style={{ flexShrink: 0 }}
          mr={3}
          height="fit-content"
        >
          <Frown color="white" />
        </UI.Icon>
        <UI.Div>
          <UI.Text paddingRight={2}>
            {node.header}
          </UI.Text>
          <UI.Text paddingRight={2}>
            {node.helper}
          </UI.Text>
          <UI.MicroLabel
            bg={theme.colors.main['500']}
            color={theme.colors.white}
          >
            Pre-Form-Node
          </UI.MicroLabel>
        </UI.Div>
      </UI.Flex>
    </NodeCellContainer>
  );
};
