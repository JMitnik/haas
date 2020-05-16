import styled, { css } from 'styled-components/macro';

export const DashboardContainer = styled.div`
  ${({ theme }) => css`
      display: grid;
      overflow: hidden;
      grid-template-columns: 200px 1fr;
      background: white;
      height: 100vh;

      > * {
          padding-top: ${theme.gutter * 2}px;
      }
  `}
`;

export const CustomerCardImage = styled.img`
  width: 75px;
  height: 75px;
  object-fit: contain;
  margin-right: 5%;
`;
