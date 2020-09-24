import { AvatarBadge, Badge, Button, Avatar as ChakraAvatar, Icon, useToast } from '@chakra-ui/core';
import { Div, Flex, Text } from '@haas/ui';
import { ExternalLink, LogOut } from 'react-feather';
import { Link, LinkProps, NavLink, useHistory } from 'react-router-dom';
import Color from 'color';
import React from 'react';
import styled, { css } from 'styled-components/macro';

import { ReactComponent as DeFlag } from 'assets/images/de.svg';
import { ReactComponent as EnFlag } from 'assets/images/en.svg';
import { FullLogo, FullLogoContainer, LogoContainer } from 'components/Logo/Logo';
import { UserProps } from 'types/generic';
import { useCustomer } from 'providers/CustomerProvider';
import { useTranslation } from 'react-i18next';
import { useUser } from 'providers/UserProvider';
import useAuth from 'hooks/useAuth';

import Dropdown from 'components/Dropdown';
import List from 'components/List/List';
import ListItem from 'components/List/ListItem';

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
    color: ${theme.isDarkColor ? Color(theme.colors.primaries['100']).lighten(0.2).hex() : theme.colors.primaries['300']};
    padding: 8px 11px;
    margin-left: ${theme.gutter}px;
    display: flex;
    align-items: center;
    flex-direction: column;
    font-size: 0.7rem;

    /* For the icons */
    svg {
      width: 24px;
      fill: ${theme.isDarkColor ? theme.colors.primaries['100'] : theme.colors.primaries['300']};

      .secondary {
        fill: ${theme.isDarkColor ? theme.colors.primaries['100'] : theme.colors.primaries['600']};
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
    list-style: none;

    ${NavItemContainer} + ${NavItemContainer} {
      margin-top: ${theme.gutter}px;
    }
  `}
`;

export const NavLogo = () => (
  <FullLogo />
);

export const UsernavContainer = styled.div`
  ${({ theme }) => css`
    /* padding: 0 ${theme.gutter}px; */
    /* display: flex;
    align-items: center;
    cursor: pointer;
    color: ${theme.isDarkColor ? theme.colors.primaries['100'] : theme.colors.primaries['800']};
    transition: all 0.2s cubic-bezier(0.19, 1, 0.22, 1);
    position: relative;

    &:hover {
      transition: all 0.2s cubic-bezier(0.19, 1, 0.22, 1);
      background: ${theme.isDarkColor ? theme.colors.primaries['400'] : theme.colors.primaries['800']};
      color: ${theme.isDarkColor ? theme.colors.primaries['600'] : theme.colors.primaries['100']};
    } */
  `}
`;

export const AvatarContainer = styled(Div)`
  ${({ theme }) => css`
    padding: ${theme.gutter}px;
    z-index: 1200;

    &:hover {
      cursor: pointer;

      > * {
        transition: all cubic-bezier(0.6, -0.28, 0.735, 0.045) 0.2s;
        box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.45);
      }
    }
  `}
`;

export const UsernavDropdown = () => {
  const history = useHistory();
  const { user, logout } = useUser();
  const { activeCustomer, setActiveCustomer } = useCustomer();
  const { canAccessAdmin } = useAuth();
  const { t, i18n } = useTranslation();
  const toast = useToast();

  const goToDialoguesOverview = () => {
    setActiveCustomer(null);
    history.push('/dashboard');
  };

  const switchToGerman = () => {
    i18n.changeLanguage('de');
    localStorage.setItem('language', 'de');

    setTimeout(() => {
      toast({
        title: t('toast:locale_switch'),
        description: t('toast:locale_switch_german'),
        status: 'success',
        position: 'bottom-right',
        duration: 1500,
      });
    }, 400);
  };

  const switchToEnglish = () => {
    i18n.changeLanguage('en');
    localStorage.setItem('language', 'en');

    setTimeout(() => {
      toast({
        title: t('toast:locale_switch'),
        description: t('toast:locale_switch_english'),
        status: 'success',
        position: 'bottom-right',
        duration: 1500,
      });
    }, 400);
  };
  return (
    <List>
      <ListItem isHeader>
        <Div py={2}>
          <Flex justifyContent="space-between">
            <Div>
              <ChakraAvatar bg="gray.300" size="md" name={`${user?.firstName} ${user?.lastName}`}>
                <AvatarBadge size="1em" bg="green.400" />
              </ChakraAvatar>
            </Div>
            <Div ml={4}>
              <Text>{`${user?.firstName} ${user?.lastName}`}</Text>
              {activeCustomer && (
                <Text mt={1} color="gray.400" fontSize="0.7rem">
                  in
                  {' '}
                  {activeCustomer?.name}
                  {' '}
                  as
                  {' '}
                  <Badge variantColor="default" fontSize="0.5rem">
                    {activeCustomer?.userRole?.name}
                  </Badge>
                </Text>
              )}
              <Button size="sm" fontSize="0.8rem" mt={3}>
                <Link to="/dashboard/me/edit">{t('edit_user')}</Link>
              </Button>
            </Div>
          </Flex>
        </Div>
      </ListItem>
      <Div>
        <ListItem onClick={switchToEnglish}>
          <Text ml={2}>
            {t('english')}
          </Text>
        </ListItem>
        <ListItem onClick={switchToGerman}>
          <Text ml={2}>
            {t('german')}
          </Text>
        </ListItem>
      </Div>
      <Div>
        {((user?.userCustomers?.length && user?.userCustomers.length > 1) || canAccessAdmin) && setActiveCustomer && (
          <ListItem renderLeftIcon={<ExternalLink />} onClick={goToDialoguesOverview}>
            <Text ml={2}>
              {t('switch_project')}
            </Text>
          </ListItem>
        )}
        <ListItem renderLeftIcon={<LogOut />} onClick={logout}>
          <Text ml={2}>
            {t('logout')}
          </Text>
        </ListItem>
      </Div>
    </List>
  );
};

export const Usernav = () => {
  const history = useHistory();
  const { user, logout } = useUser();
  const { setActiveCustomer } = useCustomer();
  const { canAccessAdmin } = useAuth();
  const { t, i18n } = useTranslation();
  const toast = useToast();

  const goToDialoguesOverview = () => {
    setActiveCustomer(null);
    history.push('/dashboard');
  };

  const switchToGerman = () => {
    i18n.changeLanguage('de');
    localStorage.setItem('language', 'de');

    setTimeout(() => {
      toast({
        title: t('toast:locale_switch'),
        description: t('toast:locale_switch_german'),
        status: 'success',
        position: 'bottom-right',
        duration: 1500,
      });
    }, 400);
  };

  const switchToEnglish = () => {
    i18n.changeLanguage('en');
    localStorage.setItem('language', 'en');

    setTimeout(() => {
      toast({
        title: t('toast:locale_switch'),
        description: t('toast:locale_switch_english'),
        status: 'success',
        position: 'bottom-right',
        duration: 1500,
      });
    }, 400);
  };

  return (
    <UsernavContainer>
      <Dropdown left="24px" bottom="100%" renderOverlay={<UsernavDropdown />}>
        <AvatarContainer>
          <ChakraAvatar bg="gray.300" size="md" name={`${user?.firstName} ${user?.lastName}`}>
            <AvatarBadge size="1em" bg="green.400" />
          </ChakraAvatar>
        </AvatarContainer>
      </Dropdown>
    </UsernavContainer>
  );
};

export const SidenavContainer = styled.div`
  ${({ theme }) => css`
    position: fixed;
    z-index: 1200;
    font-weight: 1000;
    width: ${theme.sidenav.width}px;

    background: ${theme.isDarkColor ? theme.colors.primary : theme.colors.primaries['700']};
    display: flex;
    padding-top: ${theme.gutter}px;
    height: 100vh;
    flex-direction: column;
    justify-content: space-between;
    
    ${FullLogoContainer} {
      color: ${theme.isDarkColor ? theme.colors.primaries['100'] : theme.colors.primaries['300']};
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
