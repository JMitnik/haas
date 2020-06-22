import { LinkProps, NavLink } from 'react-router-dom';
import styled, { css } from 'styled-components/macro';

const Tabbar = styled.div`
  ${({ theme }) => css`
    display: flex;
    width: 100%;
    border-bottom: 1px solid ${theme.colors.app.mutedOnDefault};
  `}
`;

export const Tab = styled(NavLink)<LinkProps>`
  ${({ theme }) => css`
    &.active {
      border-bottom: 2px solid ${theme.colors.primary};
    }
  `}
`;

export default Tabbar;
