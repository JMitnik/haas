import styled, { css } from 'styled-components';
import React, { FC } from 'react';
import { Link, LinkProps } from 'react-router-dom';
import { ChevronLeft, Settings } from 'react-feather';

import { GenericProps, Div } from './Generics';
import { ProfilePic } from './User';
import { Helper, Paragraph } from './Type';
import { color as colorMixin, ColorProps } from 'styled-system';
import { Icon } from './Icon';
import { Flex } from './Container';

const TopNavContainer = styled(Div) <GenericProps>`
  ${({ theme }) => css`
    box-shadow: 0px 5px 7px -2px rgba(0, 0, 0, 0.4);
    border-top: 5px solid ${theme.colors.primary};

    a {
      color: ${theme.colors.default.dark};
      text-decoration: none;
    }
  `}
`;

const BreadCrumbContainer = styled.div`
  > a {
    display: inline-block;
  }
`

export const Breadcrumb = ({ children, ...props }: LinkProps) => (
  <BreadCrumbContainer>
    <Link {...props}>
      <Flex alignItems="center">
        <Helper style={{ display: 'flex', alignItems: 'center', fontSize: '0.7rem' }}>
          <Icon as={ChevronLeft} width="18px" color="currentColor" />
          {children}
        </Helper>
      </Flex>
    </Link>
  </BreadCrumbContainer>
)

export const ExtLinkContainer = styled.a<ColorProps>`
  ${({ theme, color }) => css`
    ${colorMixin};

    text-decoration: none;
    font-weight: 600;
    /* @ts-ignore */
    color: ${color ? (theme as unknown as Record<string, Record<string, string>>).colors[color as string] : theme.colors.blue[300]};
  `}
`;

export const ExtLink = ({ children, to, color }: { children: React.ReactNode, to: string, color?: string }) => (
  <ExtLinkContainer color={color} as="a" href={to} target="_blank" rel="noopener noreferrer">{children}</ExtLinkContainer>
);

export const TopNav: FC = () => (
  <TopNavContainer>
    <Link to="/">
    </Link>
  </TopNavContainer>
);

export default {};
