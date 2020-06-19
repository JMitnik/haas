import { SidenavContainer } from 'components/Sidenav/Sidenav';
import styled, { css } from 'styled-components/macro';

export const DashboardContainer = styled.div`
  ${({ theme }) => css`
    display: grid;
    grid-template-columns: ${theme.sidenav.width}px 1fr;
    background: ${theme.colors.app.background};
    height: 100vh;
  `}
`;

export const CustomerCardImage = styled.img`
  width: 75px;
  height: 75px;
  object-fit: contain;
  margin-right: 5%;
`;
