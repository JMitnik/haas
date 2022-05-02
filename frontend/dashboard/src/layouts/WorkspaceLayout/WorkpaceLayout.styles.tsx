import * as UI from '@haas/ui';
import { LinkProps, NavLink } from 'react-router-dom';
import styled, { css } from 'styled-components';

export const SubNav = styled.ul``;

interface SubNavItemProps {
  isDisabled?: boolean;
}

export const SubNavItem = styled.li<SubNavItemProps>``;

export const DashboardViewContainer = styled(UI.Div)`
  ${({ theme }) => css`
    ${UI.PageHeading} {
      color: ${theme.colors.app.onDefault};
    }
  `}
`;

export const NavItems = styled.div``;

interface NavItemContainerProps {
  isSubchildActive?: boolean;
}

export const NavItemContainer = styled.li<NavItemContainerProps>`
  ${({ theme, isSubchildActive }) => css`
    position: relative;

    ${isSubchildActive && css`
      ${SubNav} {
        position: relative;
        margin: 0;
        padding: 0 12px;
        margin-left: 20px;
        padding-left: 20px !important;
        grid-gap: 0px !important;

        .active {
          background: linear-gradient(298.18deg, #4C5ABB 0.84%, rgba(96, 111, 219, 0.8) 100%);
          border-radius: 10px;
          color: white;
          padding: 6px 11px;
        }

        &::before {
          content: '';
          top: 0;
          z-index: 200;
          bottom: 0;
          position: absolute;
          left: 0;
          height: 100%;
          width: 3px;
          background: ${theme.colors.gray[200]};
        }
      }
    `}

    @media print {
      display: none;
    }
  `}
`;

interface NavLinkProps extends LinkProps {
  // Styled-components does not pass props with a dollar sign to the underlying element.
  $isDisabled?: boolean;
}

export const NavLinkContainer = styled(NavLink) <NavLinkProps>`
  ${({ $isDisabled }) => css`
    display: flex;
    align-items: center;

    ${$isDisabled && css`
      opacity: 0.3;
      pointer-events: none;
      cursor: not-allowed;
    `}
  `}
`;
