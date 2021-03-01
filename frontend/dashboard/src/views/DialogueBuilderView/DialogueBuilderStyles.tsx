/* eslint-disable import/prefer-default-export */
import { Div, Icon } from '@haas/ui';
import styled, { css } from 'styled-components';

export const DialogueBuilderContainer = styled(Div)``;
export const NodeCellContainer = styled.div`
  ${({ theme }) => css`
    background: white;
    cursor: pointer;
    border: 1px solid ${theme.colors.gray[200]};
    border-radius: 10px;
    margin: 4px;
    cursor: pointer;
    transition: all .3s cubic-bezier(.55,0,.1,1);

    &:hover {
      box-shadow: rgb(0 0 0 / 10%) 0px 1px 3px 0px, rgb(0 0 0 / 6%) 0px 1px 2px 0px;
      transition: all .3s cubic-bezier(.55,0,.1,1);
    }

    /* Assuming this is the select-option */
    > * {
      border-radius: 10px;
    }

    ${Icon} {
        border-radius: 10px;
        padding: 6px;
        margin-right: ${theme.gutter / 2}px;

        svg {
          fill: currentColor;
        }
    }
  `}
`;