import * as UI from '@haas/ui';
import React from 'react';

import { NodeCellContainer } from 'components/NodeCell/NodeCellTypes';

interface NodeCellProps {
  condition: any;
  onClick?: () => void;
  onRemove: () => void;
}

export const ConditionCell = ({ condition, onClick, onRemove }: NodeCellProps) => {
  if (!condition.scopeType) return null;

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
        <UI.Div>
          <UI.Text paddingRight={2}>
            <UI.Span color="#4A5568" fontWeight="bold">{condition?.aggregate}</UI.Span>
            {' '}
            of option
            {' '}
            <UI.Span color="#4A5568" fontWeight="bold">
              {condition?.questionOption || condition?.activeQuestion?.label}
            </UI.Span>
            {' '}
            in the last
            {' '}
            <UI.Span color="#4A5568" fontWeight="bold">{condition?.latest}</UI.Span>
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
            {' '}
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
