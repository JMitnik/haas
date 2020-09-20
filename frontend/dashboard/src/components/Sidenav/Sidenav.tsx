import { AvatarBadge, Avatar as ChakraAvatar, Icon, Menu, MenuButton, MenuDivider, MenuGroup, MenuItem, MenuList, useToast } from '@chakra-ui/core';
import { ExternalLink, LogOut } from 'react-feather';
import { Flex, Text } from '@haas/ui';
import { LinkProps, NavLink, useHistory } from 'react-router-dom';
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

export const Usernav = ({ user }: { user: UserProps, customer: any }) => {
  const history = useHistory();
  const { user: activeUser, logout } = useUser();
  const { setActiveCustomer } = useCustomer();
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
    <Menu>
      <MenuButton>
        <UsernavContainer>
          <Flex py={4} alignItems="center">
            <ChakraAvatar bg="gray.300" size="md" name={`${user.firstName} ${user.lastName}`}>
              <AvatarBadge size="1em" bg="green.400" />
            </ChakraAvatar>
          </Flex>
        </UsernavContainer>
      </MenuButton>
      <MenuList>
        <MenuGroup title={t('language')}>
          <MenuItem onClick={switchToEnglish} color="gray.600">
            <Icon as={EnFlag} overflow="visible" />
            <Text ml={2}>
              {t('english')}
            </Text>
          </MenuItem>
          <MenuItem onClick={switchToGerman} color="gray.600">
            <Icon as={DeFlag} />
            <Text ml={2}>
              {t('german')}
            </Text>
          </MenuItem>
        </MenuGroup>
        <MenuDivider />
        <MenuGroup title={t('user_actions')}>
          {activeUser.userCustomers.length > 1 && (
            <MenuItem color="gray.600" onClick={goToDialoguesOverview}>
              <Icon as={ExternalLink} />
              <Text ml={2}>
                {t('switch_project')}
              </Text>
            </MenuItem>
          )}
          <MenuItem onClick={logout} color="gray.600">
            <Icon as={LogOut} />
            <Text ml={2}>
              {t('logout')}
            </Text>
          </MenuItem>
        </MenuGroup>
      </MenuList>
    </Menu>
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
