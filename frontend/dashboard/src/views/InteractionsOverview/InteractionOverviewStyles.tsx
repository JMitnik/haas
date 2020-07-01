import { Div } from '@haas/ui';
import styled, { css } from 'styled-components';

const FlexRow = styled(Div)`
  display: flex;
  flex-direction: row;
`;

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

export const InputOutputContainer = styled(FlexRow)`
  justify-content: space-between;
`;

export const InputContainer = styled(FlexRow)`
  align-items: center;
`;

export const OutputContainer = styled(FlexRow)`
  align-items: center;
`;

export const InteractionsOverviewContainer = styled(Div)`
  ${({ theme }) => css`
    padding: ${theme.gutter * 2}px 0;
  `}
`;
