/* eslint-disable import/prefer-default-export */
import styled, { css } from 'styled-components/macro';

export const TimelineEntriesContainer = styled.div`
  height: 80vh;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  overflow-y: auto;
`;

export const TimelineFeedOverviewContainer = styled.div`
  ${({ theme }) => css`
    display: flex;
    flex-direction: column;
    background: #f7f9fe;
    border-radius: 20px;
    padding: ${theme.gutter}px;
  `}
`;
