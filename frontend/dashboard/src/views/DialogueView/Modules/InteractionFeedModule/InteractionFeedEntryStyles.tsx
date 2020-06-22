import styled, { css } from 'styled-components/macro';

export const InteractionFeedEntryContainer = styled.div`
   ${() => css`
    display: grid;
    grid-template-columns: 50px 1fr;
    grid-gap: 0px 24px;
    padding: 8px 14px;
    border-radius: 7px;
    background: #ffffff;
    color: #323944;
    box-shadow: 1;
    margin: 12px 0;
    transition: all .3s cubic-bezier(.55,0,.1,1);
    cursor: pointer;
    box-shadow: 0px 1px 4px 1px rgba(176, 185, 206, 0.15);

    :hover {
      transition: all .3s cubic-bezier(.55,0,.1,1);
      transform: scale(1.1);
      box-shadow: 0px 1px 4px 1px rgba(176, 185, 206, 0.35);
    }
  `}
`;

export const InteractionFeedEntryValueContainer = styled.div<{value: number}>`
  ${({ value }) => css`
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px;
    font-weight: 1000;
    font-size: 1.5rem;

    ${value < 50 && css`
      background: #FED7D7;
      color: #E53E3E;
    `}

    ${value >= 50 && value < 75 && css`
      background: #FEEBC8;
      color: #C05621;
    `}

    ${value >= 75 && value < 95 && css`
      background: #C6F6D5;
      color: #2F855A;
    `}

    ${value >= 95 && css`
      background: #BEE3F8;
      color: #2B6CB0;
    `}
  `}
`;
