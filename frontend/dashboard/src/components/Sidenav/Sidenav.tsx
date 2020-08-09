import { ArrowRightCircle } from 'react-feather';
import { AvatarBadge, Badge, Avatar as ChakraAvatar } from '@chakra-ui/core';
import { Card, ColumnFlex, Div, Flex, Span } from '@haas/ui';
import { LinkProps, NavLink, useHistory } from 'react-router-dom';
import React from 'react';
import styled, { css } from 'styled-components/macro';

import { FullLogo, FullLogoContainer, LogoContainer } from 'components/Logo/Logo';
import { UserProps } from 'types/generic';
import { useCustomer } from 'providers/CustomerProvider';
import Avatar from 'components/Avatar';
import Logo from 'components/Logo';

interface NavItemProps extends LinkProps { }

export const NavItemContainer = styled.li`
`;

export const NavItem = ({ children, ...props }: NavItemProps) => (
  <NavItemContainer>
    <NavLinkContainer {...props}>{children}</NavLinkContainer>
  </NavItemContainer>
);

export const NavLinkContainer = styled(NavLink) <LinkProps>`
  ${({ theme }) => css`
    color: ${theme.isDarkColor ? theme.colors.primaries['100'] : theme.colors.primaries['800']};
    padding: 8px 11px;
    margin-left: ${theme.gutter}px;
    display: flex;
    align-items: center;
    flex-direction: column;
    font-size: 0.7rem;

    /* For the icons */
    svg {
      width: 24px;
      fill: ${theme.isDarkColor ? theme.colors.primaries['400'] : theme.colors.primaries['800']};

      .secondary {
        fill: ${theme.isDarkColor ? theme.colors.primaries['400'] : theme.colors.primaries['700']};
      }
    }

    /* If active react router */
    &.active {
      background: ${theme.isDarkColor ? theme.colors.primaries['300'] : theme.colors.primaries['800']};
      border-radius: ${theme.borderRadiuses.somewhatRounded};
      color: white;

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

export const NavLogo = () => (
  <FullLogo />
);

const UsernavContainer = styled.div`
  ${({ theme }) => css`
    padding: 0 ${theme.gutter}px;
    display: flex;
    width: 100%;
    align-items: center;
    cursor: pointer;
    color: ${theme.isDarkColor ? theme.colors.primaries['100'] : theme.colors.primaries['800']};
    border-top: 1px solid ${theme.isDarkColor ? theme.colors.primaries['300'] : theme.colors.primaries['600']};
    transition: all 0.2s cubic-bezier(0.19, 1, 0.22, 1);

    &:hover {
      transition: all 0.2s cubic-bezier(0.19, 1, 0.22, 1);
      background: ${theme.isDarkColor ? theme.colors.primaries['400'] : theme.colors.primaries['800']};
      color: ${theme.isDarkColor ? theme.colors.primaries['600'] : theme.colors.primaries['100']};
    }
  `}
`;

export const ArrowContainer = styled.button`
  border: none;
  background: #f6f7f9;
  color: #a1a2a5;

  svg {
    width: 16px;
    height: 16px;
  }

  opacity: 0.7;
  cursor: pointer;
  transition: all 0.2s ease-in;
`;

export const Usernav = ({ user, customer }: { user: UserProps, customer: any }) => {
  const history = useHistory();
  const { setActiveCustomer, setStorageCustomer } = useCustomer();

  const goToDialoguesOverview = () => {
    setStorageCustomer(null);
    setActiveCustomer(null);
    history.push('/dashboard');
  };

  return (
    <UsernavContainer onClick={() => goToDialoguesOverview()}>
      <Flex py={4} alignItems="center">
        <ChakraAvatar bg="gray.300" size="md" name={`${user.firstName} ${user.lastName}`}>
          <AvatarBadge size="1em" bg="green.400" />
        </ChakraAvatar>

        {/* <Div ml={4}>
          <ColumnFlex>
            <Span fontSize="0.8rem" display="block">
              {`${user.firstName} ${user.lastName}`}
            </Span>

            <Div>
              <Badge>
                {customer?.name}
              </Badge>
            </Div>
          </ColumnFlex>
        </Div> */}
      </Flex>
    </UsernavContainer>
  );
};

export const SidenavContainer = styled.div`
  ${({ theme }) => css`

    position: fixed;
    z-index: 300;
    font-weight: 1000;
    width: ${theme.sidenav.width}px;

    background: ${theme.colors.primary};
    display: flex;
    padding-top: ${theme.gutter}px;
    height: 100vh;
    flex-direction: column;
    justify-content: space-between;

    ${FullLogoContainer} {
      color: ${theme.isDarkColor ? theme.colors.primaries['100'] : theme.colors.primaries['800']};
    }

    ${LogoContainer} {
      color: ${theme.isDarkColor ? theme.colors.primaries['100'] : theme.colors.primaries['800']};
    }

    ${NavItems} {
      padding-top: 100px;
    }

    ul {
      a {
        text-decoration: none;
        margin-left: ${theme.gutter * 0.5}px;
        margin-right: ${theme.gutter * 0.5}px;

        span {
            display: inline-block;
        }
      }
    }
  `}
`;

const Sidenav = ({ children }: { children: React.ReactNode }) => (
  <SidenavContainer data-cy="Sidenav">
    {children}
  </SidenavContainer>
);

export default Sidenav;
