import styled, { css } from 'styled-components/macro';

export const TimelineEntryContainer = styled.div`
   ${({ theme }) => css`
    display: grid;
    grid-template-columns: 50px 1fr;
    grid-gap: 0px 24px;
    padding: 8px 14px;
    border-radius: 7px;
    background: #ffffff;
    /* border-bottom: 1px solid #d0d0d2; */
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
