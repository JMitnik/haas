import styled, { css } from 'styled-components';
import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import { Settings } from 'react-feather';
import Logo from '../assets/Logo';
import { Container } from './Container';
import { GenericProps, Div } from './Generics';
import { ProfilePic } from './User';

const TopNavContainer = styled(Div)<GenericProps>`
  ${({ theme }) => css`
    box-shadow: 0px 5px 7px -2px rgba(0, 0, 0, 0.4);
    border-top: 5px solid ${theme.colors.primary};
    border-bottom: 1px solid ${theme.colors.default.normal};

    a {
      color: ${theme.colors.default.light};
      text-decoration: none;
    }
  `}
`;

const UserNav: FC = () => (
  <Div useFlex width={1 / 10} alignItems="center" justifyContent="space-evenly">
    <Link to="/settings">
      <Settings />
    </Link>
    <Div pl={4}>
      <ProfilePic />
    </Div>
  </Div>
);

export const TopNav: FC = () => (
  <TopNavContainer bg="white">
    <Container p="4" useFlex justifyContent="space-between" alignItems="center">
      <Link to="/">
        <Logo />
      </Link>
      <UserNav />
    </Container>
  </TopNavContainer>
);

export default {};
