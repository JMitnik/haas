import * as UI from '@haas/ui';
import React from 'react';

import { NodeCellContainer } from 'components/NodeCell/NodeCellTypes';
import { TargetTypeEnum } from 'components/NodePicker/UserNodePicker';

export interface MapNodeToPropertiesOutput {
  bg: string;
  color: string;
  first: string;
}

export const MapNodeToProperties = (type: (TargetTypeEnum)): MapNodeToPropertiesOutput => {
  switch (type) {
    case TargetTypeEnum.User: {
      return {
        bg: '#FE3274',
        color: '#f9fbfa',
        first: 'U',
      };
    }

    case TargetTypeEnum.Role: {
      return {
        bg: '#40A9FF',
        color: '#f9fbfa',
        first: 'R',
      };
    }

    default: {
      return {
        bg: '#e4e5ec',
        color: '#323546',
        first: 'U',
      };
    }
  }
};

interface NodeCellProps {
  node: any;
  onClick?: () => void;
  onRemove: () => void;
}

export const TargetCell = ({ node, onClick, onRemove }: NodeCellProps) => {
  if (!node.type) return null;
  const nodeProps = MapNodeToProperties(node.type);
  const isUser = node.type === TargetTypeEnum.User;

  const removeCTAFromOption = (e: any) => {
    e.stopPropagation();
    onRemove();
  };

  return (
    <NodeCellContainer onClick={onClick} style={{ padding: '8px 12px', width: '100%', position: 'relative' }}>
      <UI.CloseButton onClose={removeCTAFromOption} top="5px" right="5px" />
      <UI.Flex width="100%" alignItems="center">
        <UI.Div
          display="flex"
          justifyContent="center"
          bg={nodeProps.bg}
          color="white"
          padding="0.4em 0.8em"
          mr={3}
          borderRadius="10px"
        >
          <UI.Span fontWeight="bold">{nodeProps.first}</UI.Span>
        </UI.Div>
        <UI.Div>
          <UI.Text paddingRight={2}>
            {isUser && (
              <>
                <UI.Span>User</UI.Span>
                {' '}
                <UI.Span color="#4A5568" fontWeight="bold">{node?.label}</UI.Span>
                {' '}
                <UI.Span>will be added as a target for this action </UI.Span>
              </>

            )}
            {!isUser && (
              <>
                <UI.Span>All users with the role</UI.Span>
                {' '}
                <UI.Span color="#4A5568" fontWeight="bold">{node?.label}</UI.Span>
                {' '}
                <UI.Span>will be added as a target for this action</UI.Span>
              </>
            )}
          </UI.Text>
          <UI.MicroLabel
            bg={nodeProps.bg}
            color={nodeProps.color !== 'transparent' ? nodeProps.color : 'white'}
          >
            {node.type}
          </UI.MicroLabel>
        </UI.Div>
      </UI.Flex>
    </NodeCellContainer>
  );
};
