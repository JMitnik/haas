import * as UI from '@haas/ui';
import styled, { css } from 'styled-components';

import scoreToColors from 'utils/scoreToColors';

export const InteractionFeedEntryContainer = styled.div`
   ${() => css`
    display: flex;
    flex-direction: column;
    font-size: 0.7rem;
    font-weight: 400;
    padding: 8px 0;
    border-bottom: 1px solid #e6ecf4;
    transition: all .3s cubic-bezier(.55,0,.1,1);
    cursor: pointer;
    margin-bottom: auto;

    &:last-child {
      border-bottom: none;
    }
  `}
`;

export const DialoguePathCrumbContainer = styled(UI.Div) <{ isInline?: boolean | null }>`
  ${({ theme, isInline = false }) => css`
      display: flex;
      align-items: center;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      font-weight: 500;
      height: 40px;
      padding: 0;
      border: 1px solid white;
      justify-content: center;
      border-radius: 100px !important;
      background: ${theme.colors.gray[300]};
      width: 40px;
      
      ${isInline && css`
        margin-left: -8px;
      `}
      
      &:first-of-type {
        border-top-left-radius: 30px;
        border-border-bottom-left-radius: 30px;
      }

      &:last-of-type {
        border-top-right-radius: 30px;
        border-bottom-right-radius: 30px;
      }

      svg {
        width: 24px;
        height: 24px;
      }
  `}
`;
