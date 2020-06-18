import { ColumnFlex, Div, Flex, H4 } from '@haas/ui';
import { NavLink } from 'react-router-dom';
import { UserProps } from 'types/generic';
import Avatar from 'components/Avatar';
import React from 'react';
import styled, { css } from 'styled-components/macro';

const SidenavContainer = styled.div`
  ${({ theme }) => css`
    background: ${theme.colors.app.sidebar};
    padding: ${theme.gutter * 1.5}px;
    display: flex;
    height: 100vh;
    flex-direction: column;
    justify-content: space-between;

    ul {
        display: block;
        color: black;
        margin-top: ${theme.gutter * 2}px;

      li {
        display: flex;
        margin-bottom: ${theme.gutter}px;
        color: #9088d5;
      }

      a {
        display: flex;
        color: inherit;
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

export const NavItems = styled.ul``;

export const NavItem = styled(NavLink)`
  color: red;
`;

const Sidenav = ({ children }: { children: React.ReactNode }) => (
  <SidenavContainer>
    {children}
  </SidenavContainer>
);

export const Usernav = ({ user }: { user: UserProps }) => (
  <Flex justifyContent="space-between">
    <Avatar firstName={user.firstName} />
    <ColumnFlex>
      <H4>
        {`${user.firstName} ${user.lastName}`}
      </H4>
    </ColumnFlex>
  </Flex>
);

export default Sidenav;
