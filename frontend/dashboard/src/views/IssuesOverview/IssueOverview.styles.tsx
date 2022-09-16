import * as UI from '@haas/ui';
import { ActionableState } from 'types/generated-types';
import { format } from 'date-fns';
import React from 'react';
import styled, { css } from 'styled-components';

export const DateCell = ({ timestamp }: { timestamp: string }) => {
  const date = new Date(parseInt(timestamp, 10));

  const formattedDate = format(date, 'd MMM yyyy');
  const formattedTimestamp = format(date, 'HH:mm');

  return (
    <UI.ColumnFlex>
      <UI.Helper>{formattedDate}</UI.Helper>
      <UI.Span color="gray.400" fontWeight={600}>{formattedTimestamp}</UI.Span>
    </UI.ColumnFlex>
  );
};

export const ChangeableEmailContainer = styled(UI.Div)`
 ${({ theme }) => css`
    display: flex;
    align-items: center;
    color: ${theme.colors.off[500]};
    
    button {
        margin-left: 10px;
        max-width: 20px !important;
        max-height: 20px;

        min-width: auto;
        min-height: auto;

        svg {
          width: 80%;
          height: 100%;
        }
      }
 `}
  
`;

export const UrgentContainer = styled(UI.Div) <{ hasUrgent?: boolean }>`
  ${({ theme, hasUrgent }) => css`
    display: flex;
    width: fit-content;
    align-items: center;
    border-radius: ${theme.borderRadiuses.sm}px;
    font-weight: 700;
    padding: 0.5em;
    text-align: center;
    
    background: ${theme.colors.off[100]};
    color: ${theme.colors.off[500]};

    ${hasUrgent && css`
      background: ${theme.colors.red[100]};
      color: ${theme.colors.red[500]};
    `}
  `}
`;

interface StatusContainerProps {
  status: ActionableState;
  isSelected?: boolean;
}

export const StatusContainer = styled(UI.Div) <StatusContainerProps>`
  ${({ theme, status, isSelected }) => css`
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: ${theme.borderRadiuses.sm}px;
    font-weight: 700;
    padding: 5px;
    text-align: center;

    ${(status === ActionableState.Dropped) && css`
      background: ${theme.colors.gray[100]};
      color: ${theme.colors.gray[500]};

      ${isSelected && css`
        border: 1px solid ${theme.colors.gray[500]};
      `}
    `}

    ${status === ActionableState.Pending && css`
      background: ${theme.colors.orange[100]};
      color: ${theme.colors.orange[500]};
      
      ${isSelected && css`
        border: 1px solid ${theme.colors.orange[500]};
      `}
    `}

    ${status === ActionableState.Completed && css`
      background: ${theme.colors.green[100]};
      color: ${theme.colors.green[500]};

      ${isSelected && css`
        border: 1px solid ${theme.colors.green[500]};
      `}
    `}

    ${status === ActionableState.Stale && css`
      background: ${theme.colors.red[100]};
      color: ${theme.colors.red[500]};

      ${isSelected && css`
        border: 1px solid ${theme.colors.red[500]};
      `}
    `}
  `}
`;

interface StatusBoxProps {
  isSelected?: boolean;
  status: ActionableState;
}

export const StatusBox = ({ status, isSelected }: StatusBoxProps) => (
  <StatusContainer isSelected={isSelected} status={status}>
    {status}
  </StatusContainer>
);
