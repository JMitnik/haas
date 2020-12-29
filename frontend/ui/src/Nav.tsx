import styled, { css } from 'styled-components';
import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import { Settings } from 'react-feather';

import { GenericProps, Div } from './Generics';
import { ProfilePic } from './User';
import { Paragraph } from './Type';
import { color, ColorProps } from 'styled-system';

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

export const ExtLinkContainer = styled.a<ColorProps>`
  ${({ theme }) => css`
    ${color};
    
    text-decoration: none;
    font-weight: 600;
    color: ${theme.colors.blue[300]};
  `}
`;

export const ExtLink = ({ children, to }: { children: React.ReactNode, to: string }) => (
  <ExtLinkContainer as="a" href={to}  target="_blank" rel="noopener noreferrer">{children}</ExtLinkContainer>
);

export const TopNav: FC = () => (
  <TopNavContainer>
    <Link to="/">
    </Link>
  </TopNavContainer>
);

export default {};
