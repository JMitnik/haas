import styled, { css } from 'styled-components/macro';
import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import { Settings } from 'react-feather';

import { GenericProps, Div } from './Generics';
import { ProfilePic } from './User';
import { Paragraph } from './Type';

const TopNavContainer = styled(Div)<GenericProps>`
  ${({ theme }) => css`
    box-shadow: 0px 5px 7px -2px rgba(0, 0, 0, 0.4);
    border-top: 5px solid ${theme.colors.primary};

    a {
      color: ${theme.colors.default.dark};
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

const StyledExtLink = styled.a`
  text-decoration: none;
`;

export const ExtLink = ({ children, to }: { children: React.ReactNode, to: string }) => (
  <StyledExtLink as="a" href={to}  target="_blank" rel="noopener noreferrer">{children}</StyledExtLink>
);

export const TopNav: FC = () => (
  <TopNavContainer>
    <Link to="/">
    </Link>
  </TopNavContainer>
);

export default {};
