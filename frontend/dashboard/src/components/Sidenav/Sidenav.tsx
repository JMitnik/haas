import { ColumnFlex, Div, Flex, H4, Span } from '@haas/ui';
import { LinkProps, NavLink } from 'react-router-dom';
import { UserProps } from 'types/generic';
import Avatar from 'components/Avatar';
import React from 'react';
import styled, { css } from 'styled-components/macro';

interface NavItemProps extends LinkProps {}

export const NavItemContainer = styled.li``;

export const NavItem = ({ children, ...props }: NavItemProps) => (
  <NavItemContainer>
    <NavLinkContainer {...props}>{children}</NavLinkContainer>
  </NavItemContainer>
);

export const NavLinkContainer = styled(NavLink)<LinkProps>`
  ${({ theme }) => css`
    color: ${theme.colors.app.mutedOnWhite};
    padding: ${theme.gutter * 0.5}px ${theme.gutter * 0.75}px;
    margin-left: ${theme.gutter}px;
    display: flex;
    align-items: center;

    a {
      font-size: 0.8rem;
    }

    /* For the icons */
    svg {
      width: 24px;
      margin-right: ${theme.gutter / 2}px;
      fill: ${theme.colors.app.mutedOnWhite};

      .secondary {
        fill: ${theme.colors.app.mutedAltOnWhite};
      }
    }

    /* If active react router */
    &.active {
      border-radius: ${theme.borderRadiuses.rounded} 0 0 ${theme.borderRadiuses.rounded};
      background: ${theme.colors.primary};
      color: ${theme.colors.white};

      svg {
        fill: white;
      }
    }
  `}
`;

export const NavItems = styled.ul`
  ${({ theme }) => css`
    ${NavItemContainer} + ${NavItemContainer} {
      margin-top: ${theme.gutter}px;
    }
  `}
`;

export const SidenavContainer = styled.div`
  ${({ theme }) => css`
    background: ${theme.colors.app.sidebar};
    display: flex;
    padding-top: ${theme.gutter}px;
    padding-bottom: ${theme.gutter * 2}px;
    height: 100vh;
    flex-direction: column;
    justify-content: space-between;

    ${NavItems} {
      padding-top: 100px;
    }

    ul {
      a {
        text-decoration: none;
        font-size: 1.3rem;

        span {
            margin-left: ${theme.gutter * 0.5}px;
            display: inline-block;
        }
      }
    }
  `}
`;

const Sidenav = ({ children }: { children: React.ReactNode }) => (
  <SidenavContainer>
    {children}
  </SidenavContainer>
);

const UsernavContainer = styled.div`
  ${({ theme }) => css`
    padding: 0 ${theme.gutter}px;
    display: flex;
    align-items: center;
    color: ${theme.colors.app.mutedAltOnWhite};
  `}
`;

export const Usernav = ({ user }: { user: UserProps }) => (
  <UsernavContainer>
    <Avatar name={user.firstName} />
    <Div ml={4}>
      <ColumnFlex>
        <Span fontSize="0.9rem">
          <Span color="app.mutedAltOnWhite" display="block">
            {`${user.firstName} ${user.lastName}`}
          </Span>
          <Span color="app.mutedOnWhite">
            {`${user.business.name}`}
          </Span>
        </Span>

      </ColumnFlex>
    </Div>
  </UsernavContainer>
);

export default Sidenav;
