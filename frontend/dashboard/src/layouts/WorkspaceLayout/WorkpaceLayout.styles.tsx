import * as UI from '@haas/ui';
import { Check } from 'react-feather';
import { LinkProps, NavLink } from 'react-router-dom';
import React from 'react';
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

export const Card = styled(UI.Div)`
  ${({ theme }) => css`
    background: ${theme.colors.white};
    border-radius: ${theme.borderRadiuses.md}px;
    box-shadow: ${theme.boxShadows.md};
    padding: ${theme.gutter / 1.5}px;
  `}
`;

const ItemStyles = css`
  ${({ theme }) => css`
    color: ${theme.colors.gray[500]};
    font-size: 1rem;
    font-weight: 500;
    border-radius: ${theme.borderRadiuses.md}px;
    padding: 4px 8px;
    transition: all ${theme.transitions.normal};

    &:hover {
      color: ${theme.colors.main[500]};
      transition: all ${theme.transitions.normal};
    }

    & + & {
      margin-top: 2px;
    }

    &:focus, &:hover {
      cursor: pointer;
      background: ${theme.colors.gray[100]};
      transition: all ${theme.transitions.normal};
    }

    ${UI.Icon} {
      width: 18px;
      margin-right: ${theme.gutter / 2}px;
    }
    ${UI.Icon} svg {
      max-width: 100%;
    }
  `}
`;

export const Item = styled(UI.Div)`
  ${ItemStyles}
`;

interface CheckedItemProps {
  isChecked: boolean;
}

export const CheckedItemContainer = styled(Item) <CheckedItemProps>`
  ${({ theme, isChecked }) => css`
    ${isChecked && css`
      color: ${theme.colors.main[500]};
    `}
  `}
`;

interface CheckedItemProps {
  isChecked: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}

export const CheckedItem = ({ children, isChecked, onClick }: CheckedItemProps) => (
  <CheckedItemContainer isChecked={isChecked} onClick={onClick}>
    <UI.Flex justifyContent="space-between" alignItems="center">
      {children}

      {isChecked && (
        <UI.Icon>
          <Check />
        </UI.Icon>
      )}
    </UI.Flex>
  </CheckedItemContainer>
);

export const NavItem = styled(NavLink)`
  ${({ theme }) => css`
    ${ItemStyles}
    display: block;

    &:hover {
      color: ${theme.colors.main[500]};
      transition: all ${theme.transitions.normal};
    }

    & + ${Item}, ${Item} + & {
      margin-top: 2px;
    }
  `}
`;
