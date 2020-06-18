import styled, { css } from 'styled-components/macro';

export const DashboardContainer = styled.div`
  ${({ theme }) => css`
    display: grid;
    grid-template-columns: 200px 1fr;
    background: ${theme.colors.app.background};
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
