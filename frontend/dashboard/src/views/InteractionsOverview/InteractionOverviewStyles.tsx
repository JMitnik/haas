import { Div, Grid } from '@haas/ui';
import styled, { css } from 'styled-components/macro';

const FlexRow = styled(Div)`
  display: flex;
  flex-direction: row;
`;

export const RowContainer = styled(Grid)<{isExpanded?: boolean}>`
  ${({ theme, isExpanded }) => css`
    cursor: pointer;
    padding-left: ${theme.gutter}px;
    padding-right: ${theme.gutter}px;
    border-top: ${isExpanded ? '1px solid rgba(0,0,0,.05)' : '1px solid transparent'};
    box-shadow: ${isExpanded ? '0 4px 6px -1px rgba(0,0,0,.05),0 2px 4px -1px rgba(0,0,0,.06)!important' : 'none'};
  
    &:hover {
      transition: all .2s cubic-bezier(.55,0,.1,1);
      border-top:  ${isExpanded && '1px solid rgba(0,0,0,.05)'};
      box-shadow: ${isExpanded && '0 4px 6px -1px rgba(0,0,0,.1),0 2px 4px -1px rgba(0,0,0,.06) !important'};
    }
  `}
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
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;
