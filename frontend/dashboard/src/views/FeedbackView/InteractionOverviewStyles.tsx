import { Div } from '@haas/ui';
import styled, { css } from 'styled-components';

const NODE_SCORE_SIZE = 40;

export const InteractionDetailQuestionEntry = styled(Div)`
  ${({ theme }) => css`
    display: flex;
    margin-bottom: 10px;
  
    &::before {
      content:"";
      position: absolute;
      height: 100%;
      z-index: 0;
      top: 0;
      bottom: 0;
      left: ${NODE_SCORE_SIZE / 2}px;
      border-left: 2px solid ${theme.colors.gray[300]};
    }
  `}
`;

export const InteractionsOverviewContainer = styled(Div)``;
