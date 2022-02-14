import * as UI from '@haas/ui';
import React from 'react';
import styled, { css } from 'styled-components';

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
  condition: any;
  onClick?: () => void;
  onRemove: () => void;
}

export const ConditionCell = ({ condition, onClick, onRemove }: NodeCellProps) => {
  if (!condition.scopeType) return null;

  // const nodeProps = MapNodeToProperties(node.type);

  const removeCTAFromOption = (e: any) => {
    e.stopPropagation();
    onRemove();
  };

  return (
    <NodeCellContainer
      onClick={onClick}
      style={{ margin: 0, padding: '8px 12px', width: '100%', position: 'relative' }}
    >
      <UI.CloseButton onClose={removeCTAFromOption} top="5px" right="5px" />
      <UI.Flex width="100%">
        {/* <UI.Icon
          bg={nodeProps.bg}
          color={nodeProps.color}
          height="2rem"
          width="2rem"
          stroke={nodeProps.stroke || undefined}
          style={{ flexShrink: 0 }}
          mr={3}
        >
          <nodeProps.icon />
        </UI.Icon> */}
        <UI.Div>
          <UI.Text paddingRight={2}>
            <UI.Span color="#4A5568" fontWeight="bold">{condition?.aggregate}</UI.Span>
            {' '}
            of option
            {' '}
            <UI.Span color="#4A5568" fontWeight="bold">{condition.questionOption.label}</UI.Span>
            {' '}
            in the last
            {' '}
            <UI.Span color="#4A5568" fontWeight="bold">{condition.latest}</UI.Span>
            {' '}
            entries
            {condition.dateRange && (
              <UI.Span>
                {' '}
                between
                {' '}
                {condition.dateRange?.[0]?.toString()}
                {' '}
                -
                {' '}
                {condition.dateRange?.[1]?.toString()}
                {' '}

              </UI.Span>

            )}
            should be
          </UI.Text>
          <UI.Flex pt="0.5em">
            <UI.MicroLabel
              bg="#FE3274"
              color="white"
              mr="0.5em"
            >
              {condition.scopeType}
            </UI.MicroLabel>
            <UI.MicroLabel
              bg="#40A9FF"
              color="white"
            >
              {condition.aspect?.replaceAll('_', ' ')}
            </UI.MicroLabel>
          </UI.Flex>
        </UI.Div>
      </UI.Flex>
    </NodeCellContainer>
  );
};
