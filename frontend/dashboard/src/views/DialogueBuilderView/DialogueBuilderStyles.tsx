/* eslint-disable import/prefer-default-export */
import { Div, Icon } from '@haas/ui';
import styled, { css } from 'styled-components';

export const DialogueBuilderContainer = styled(Div)``;
export const ChoiceNodeDropdownOptionContainer = styled.div`
  ${({ theme }) => css`
    border: 1px solid ${theme.colors.gray[200]};
    border-radius: 10px;
    margin: 4px;
    cursor: pointer;

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