import * as UI from '@haas/ui';
import React from 'react';
import styled, { css } from 'styled-components';

import { useFormatter } from 'hooks/useFormatter';

import { ScoreContainerState, getColorScoreState } from './ScoreBox.helpers';

interface ScoreContainerProps {
  state: ScoreContainerState;
}

export const ScoreContainer = styled(UI.Div)<ScoreContainerProps>`
  ${({ theme, state }) => css`
    width: 40px;
    height: 35px;
    font-size: 1.1rem;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: ${theme.borderRadiuses.sm}px;
    font-weight: 700;
    padding: 4px;
    text-align: center;

    ${state === 'gray' && css`
      background: ${theme.colors.gray[100]};
      color: ${theme.colors.gray[500]};
    `}

    ${state === 'orange' && css`
      background: ${theme.colors.orange[100]};
      color: ${theme.colors.orange[500]};
    `}

    ${state === 'green' && css`
      background: ${theme.colors.green[100]};
      color: ${theme.colors.green[500]};
    `}

    ${state === 'red' && css`
      background: ${theme.colors.red[100]};
      color: ${theme.colors.red[500]};
    `}
  `}
`;

interface ScoreBoxProps {
  score?: number;
}

export const ScoreBox = ({ score }: ScoreBoxProps) => {
  const state = getColorScoreState(score);
  const { formatScore } = useFormatter();

  return (
    <ScoreContainer state={state}>
      {score ? (
        formatScore(score)
      ) : (
        <>
          N/A
        </>
      )}
    </ScoreContainer>
  );
};
