import React, { Component, FC } from 'react';
import { Link } from 'react-router-dom';
import styled, { css } from 'styled-components/macro';
import { Settings } from 'react-feather';

import { Div, H3, H4 } from '@haas/ui';
import { GenericProps } from '@haas/ui/src/Generics';
import { ProfilePic } from '@haas/ui/src/User';
import Logo, { LogoContainer } from '../assets/Logo';

const UserNav: FC = () => {
  // Hardocde user

  const user = { firstName: 'Markus', lastName: 'Z.' };

  return (
    <Div useFlex width={4 / 10} alignItems="center" justifyContent="flex-end">
      <Div pl={4} useFlex alignItems="center">
        <H4 mr="4" color="primary">
          {`${user?.firstName} ${user?.lastName}`}
        </H4>
        <ProfilePic userName={user?.firstName} />
      </Div>
    </Div>
  );
};

const TopNavContainer = styled(Div)<GenericProps>`
  ${({ theme }) => css`
    box-shadow: 0px 5px 7px -2px rgba(0, 0, 0, 0.4);
    border-top: 5px solid ${theme.colors.primary};
    height: ${theme.nav.height};
    padding: ${theme.gutter * 1.5}px ${theme.gutter * 2}px;
    display: flex;
    justify-content: space-between;
    align-content: center;

    ${LogoContainer} {
      width: 60px;
    }

    a {
      color: ${theme.colors.default.dark};
      text-decoration: none;
    }
  `}
`;

const TopNav: FC = () => (
  <TopNavContainer>
    <Link to="/">
      <Logo />
    </Link>
    <UserNav />
  </TopNavContainer>
);

const SideNavContainer = styled.div`
  ${({ theme }) => css`
    background: white;
    padding: ${theme.gutter * 1.5}px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    ul {
      display: block;
      color: black;
      margin-top: ${theme.gutter * 2}px;

      li {
        display: flex;
        margin-bottom: ${theme.gutter}px;
        color: #a0a4a5;
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

        &.active {
          color: #0b1011;

          ~ svg {
            color: #0b1011;
          }
        }
      }
    }
  `}

`;

export const SideNav = ({ children }: { children: React.ReactNode }) => (
  <SideNavContainer>
    {children}
  </SideNavContainer>
);

export default TopNav;
