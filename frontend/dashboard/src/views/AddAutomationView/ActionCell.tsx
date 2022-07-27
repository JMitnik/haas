import * as UI from '@haas/ui';
import React from 'react';

import { AutomationActionType } from 'types/generated-types';
import { NodeCellContainer } from 'components/NodeCell/NodeCellTypes';

import { ActionEntry } from './CreateActionModalCard';

interface NodeCellProps {
  action?: ActionEntry;
  onClick?: () => void;
  onRemove?: () => void;
}

export const ActionCell = ({ action, onClick, onRemove }: NodeCellProps) => {
  if (!action?.type) return null;

  const removeCTAFromOption = (e: any) => {
    e.stopPropagation();
    onRemove?.();
  };

  return (
    <NodeCellContainer
      onClick={onClick}
      style={{ margin: 0, padding: '8px 12px', width: '100%', position: 'relative' }}
    >
      {onRemove && (
        <UI.CloseButton onClose={removeCTAFromOption} top="5px" right="5px" />
      )}
      <UI.Flex width="100%">
        <UI.Div>
          {action?.type === AutomationActionType.WeekReport && (
            <UI.Text paddingRight={2}>
              Sending a
              {' '}
              <UI.Span color="#4A5568" fontWeight="bold">weekly</UI.Span>
              {' '}
              report to:
              <ul>
                {action?.targets?.map((target) => (
                  <li key={`${target.target?.type}-${target.target?.label}`} style={{ marginLeft: '1em' }}>
                    {target.target?.type}
                    :
                    {' '}
                    <UI.Span color="#4A5568" fontWeight="bold">{target.target?.label}</UI.Span>
                  </li>
                ))}
              </ul>
            </UI.Text>
          )}

          {action.type === AutomationActionType.SendEmail && (
            <UI.Text paddingRight={2}>
              Sending an
              {' '}
              <UI.Span color="#4A5568" fontWeight="bold">dialogue link</UI.Span>
              {' '}
              email to:
              <ul>
                {action?.targets?.map((target) => (
                  <li key={`${target.target?.type}-${target.target?.label}`} style={{ marginLeft: '1em' }}>
                    {target.target?.type}
                    :
                    {' '}
                    <UI.Span color="#4A5568" fontWeight="bold">{target.target?.label}</UI.Span>
                  </li>
                ))}
              </ul>
            </UI.Text>
          )}

          <UI.Flex pt="0.5em">
            <UI.MicroLabel
              bg="#FE3274"
              color="white"
              mr="0.5em"
            >
              {action?.type?.replaceAll('_', ' ')}
            </UI.MicroLabel>
          </UI.Flex>
        </UI.Div>
      </UI.Flex>
    </NodeCellContainer>
  );
};
