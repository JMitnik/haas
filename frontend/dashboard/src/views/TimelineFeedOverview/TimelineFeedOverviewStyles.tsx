/* eslint-disable import/prefer-default-export */
import styled, { css } from 'styled-components/macro';

export const TimelineFeedView = styled.div`
  ${({ theme }) => css`
    display: flex;
    flex-direction: column;
    background: #daecfc;
    border-radius: 20px;
    padding: ${theme.gutter}px;
  `}
`;
