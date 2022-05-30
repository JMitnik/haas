import * as UI from '@haas/ui';
import React from 'react';
import styled, { css } from 'styled-components';

import { MapNodeToProperties } from 'components/MapNodeToProperties';

export const NodeCellContainer = styled.div`
  ${({ theme }) => css`
    background: white;
    cursor: pointer;
    border: 1px solid ${theme.colors.gray[200]};
    border-radius: 10px;
    margin: 4px;
    cursor: pointer;
    transition: all .3s cubic-bezier(.55,0,.1,1);

    &:hover {
      box-shadow: rgb(0 0 0 / 10%) 0px 1px 3px 0px, rgb(0 0 0 / 6%) 0px 1px 2px 0px;
      transition: all .3s cubic-bezier(.55,0,.1,1);
    }

    /* Assuming this is the select-option */
    > * {
      border-radius: 10px;
    }

    ${UI.Icon} {
        border-radius: 10px;
        padding: 6px;
        margin-right: ${theme.gutter / 2}px;

        svg {
          fill: currentColor;
        }
    }
  `}
`;

interface NodeCellProps {
  node: any;
  onClick?: () => void;
  onRemove: () => void;
}

export const NodeCell = ({ node, onClick, onRemove }: NodeCellProps) => {
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
            {node.type}
          </UI.MicroLabel>
        </UI.Div>
      </UI.Flex>
    </NodeCellContainer>
  );
};
