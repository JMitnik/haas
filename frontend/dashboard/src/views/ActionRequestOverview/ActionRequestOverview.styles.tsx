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
  status: string;
  isSelected?: boolean;
}

export const StatusContainer = styled(UI.Div) <StatusContainerProps>`
  ${({ theme, status }) => css`
    display: flex;
    justify-content: center;
    align-items: center;

    font-weight: 700;
    text-align: center;

    padding: 2px 6px;
    border: 1px solid transparent;
    border-radius: ${theme.borderRadiuses.md}px;
    box-shadow: ${theme.boxShadows.sm};
    &:hover {
      box-shadow: ${theme.boxShadows.md};
      transition: all ${theme.transitions.normal};
    }

    ${(status === ActionRequestState.Dropped) && css`
      background: ${theme.colors.gray[100]};
      color: ${theme.colors.gray[500]};
    `}

    ${status === ActionRequestState.Pending && css`
      background: ${theme.colors.orange[100]};
      color: ${theme.colors.orange[500]};
    `}

    ${status === ActionRequestState.Completed && css`
      background: ${theme.colors.green[100]};
      color: ${theme.colors.green[500]};
    `}

    ${status === ActionRequestState.Stale && css`
      background: ${theme.colors.red[100]};
      color: ${theme.colors.red[500]};
    `}

    ${status === 'NEW' && css`
      background: ${theme.colors.blue[100]};
      color: ${theme.colors.blue[500]};
      pointer-events: none ;
      cursor: pointer;
    `}
  `}
`;

interface StatusBoxProps {
  isSelected?: boolean;
  status: string;
  isVerified: boolean;
}

export const StatusBox = ({ status, isSelected, isVerified }: StatusBoxProps) => (
  <StatusContainer isSelected={isSelected} status={status}>
    {isVerified && status === ActionRequestState.Pending && (
      <UI.Icon mr={1} stroke="orange.500">
        <CheckCircledIcon width="20px" height="20px" />
      </UI.Icon>
    )}
    {status}
  </StatusContainer>
);
