import { background } from 'styled-system';
import scoreToColors from 'utils/scoreToColors';
import styled, { css } from 'styled-components/macro';

export const InteractionFeedEntryContainer = styled.div`
   ${() => css`
    display: flex;
    font-size: 0.7rem;
    font-weight: 400;
    padding: 8px 0;
    border-bottom: 1px solid #e6ecf4;
    transition: all .3s cubic-bezier(.55,0,.1,1);
    cursor: pointer;

    &:last-child {
      border-bottom: none;
    }
  `}
`;

export const InteractionFeedEntryValueContainer = styled.div<{value: number}>`
  ${({ value }) => css`
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    font-weight: 1000;
    font-size: 1.2rem;

    ${(({ background, color }) => css`
      background: ${background};
      color: ${color};
    `)(scoreToColors(value))}
  `}
`;
