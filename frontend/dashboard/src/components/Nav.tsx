import { Link } from 'react-router-dom';
import React, { FC } from 'react';
import styled, { css } from 'styled-components/macro';

import { Div, H4 } from '@haas/ui';
import { GenericProps } from '@haas/ui/src/Generics';
import { ProfilePic } from '@haas/ui/src/User';

import Logo, { LogoContainer } from './Logo';

const UserNav: FC = () => {
  // TODO: Remove hardcoded user {Login}
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

export default TopNav;
