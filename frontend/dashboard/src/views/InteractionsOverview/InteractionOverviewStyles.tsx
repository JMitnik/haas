import { Div } from '@haas/ui';
import styled from 'styled-components/macro';

export const InteractionDetailQuestionEntry = styled(Div)`
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;

  &::before {
    content:"";
    position: absolute;
    height: 90%;
    z-index: 0;
    top: 5%;
    bottom: 0;
    left: 51.25%;
    border-left: 2px solid #c0bcbb;
    transform: translate(-50%);
  }
`;

export const InteractionsOverviewContainer = styled(Div)``;
