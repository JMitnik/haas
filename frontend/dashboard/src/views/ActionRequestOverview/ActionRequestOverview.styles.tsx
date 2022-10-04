import * as UI from '@haas/ui';
import { ActionRequestState } from 'types/generated-types';
import { CheckCircledIcon } from '@radix-ui/react-icons';
import React from 'react';
import styled, { css } from 'styled-components';

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

interface StatusContainerProps {
  status: ActionRequestState;
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

    ${(status === ActionRequestState.Dropped) && css`
      background: ${theme.colors.gray[100]};
      color: ${theme.colors.gray[500]};

      ${isSelected && css`
        border: 1px solid ${theme.colors.gray[500]};
      `}
    `}

    ${status === ActionRequestState.Pending && css`
      background: ${theme.colors.orange[100]};
      color: ${theme.colors.orange[500]};
      
      ${isSelected && css`
        border: 1px solid ${theme.colors.orange[500]};
      `}
    `}

    ${status === ActionRequestState.Completed && css`
      background: ${theme.colors.green[100]};
      color: ${theme.colors.green[500]};

      ${isSelected && css`
        border: 1px solid ${theme.colors.green[500]};
      `}
    `}

    ${status === ActionRequestState.Stale && css`
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
  status: ActionRequestState;
  isVerified: boolean;
}

export const StatusBox = ({ status, isSelected, isVerified }: StatusBoxProps) => (
  <StatusContainer isSelected={isSelected} status={status}>
    {status}
    {isVerified && status === ActionRequestState.Pending && (
      <UI.Icon ml={1} stroke="orange.500">
        <CheckCircledIcon width="20px" height="20px" />
      </UI.Icon>
    )}

  </StatusContainer>
);
