import { NavLinkProps, NavLink } from 'react-router-dom';
import styled, { css } from 'styled-components';

const Tabbar = styled.div`
  ${({ theme }) => css`
    display: flex;
    text-decoration: none;
    width: 100%;
    border-bottom: 1px solid ${theme.colors.app.mutedOnDefault};
  `}
`;

export const Tab = styled(NavLink)<NavLinkProps>`
  ${({ theme }) => css`
    padding: 8px 12px;
    text-decoration: none;
    color: ${theme.colors.app.mutedAltOnDefault};

    &.active {
      color: ${theme.colors.primary};
      border-bottom: 2px solid ${theme.colors.primary};
    }
  `}
`;

export default Tabbar;
