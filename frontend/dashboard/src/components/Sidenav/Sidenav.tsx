import * as UI from '@haas/ui';
import { AvatarBadge, Badge, Button, Avatar as ChakraAvatar, useToast } from '@chakra-ui/core';
import { Div, Flex, Text } from '@haas/ui';
import { ExternalLink, LogOut } from 'react-feather';
import { Link, LinkProps, NavLink, useHistory } from 'react-router-dom';
import React from 'react';
import styled, { css } from 'styled-components';

import { FullLogo, FullLogoContainer, LogoContainer } from 'components/Logo/Logo';
import { useCustomer } from 'providers/CustomerProvider';
import { useTranslation } from 'react-i18next';
import { useUser } from 'providers/UserProvider';
import useAuth from 'hooks/useAuth';

import { AnimatePresence, motion } from 'framer-motion';
import Dropdown from 'components/Dropdown';
import List from 'components/List/List';
import ListItem from 'components/List/ListItem';

interface NavItemProps extends LinkProps {
  renderSibling?: React.ReactNode;
  exact?: boolean;
  isSubchildActive?: boolean;
}

export const NavItemContainer = styled.li<{ isSubchildActive?: boolean }>`
  ${({ theme, isSubchildActive }) => css`
    position: relative;
    
    ${isSubchildActive && css`
      border-radius: 5px;
      border: 1px solid ${theme.colors.gray[200]};
      overflow: hidden;
        
      &::before {
        content: '';
        top: 0;
        z-index: 200;
        bottom: 0;
        position: absolute;
        left: 0;
        height: 100%;
        width: 3px;
        background: ${theme.colors.primaryGradient};
      }
    `}
  `}
`;

export const NavItem = ({ children, renderSibling, isSubchildActive, ...props }: NavItemProps) => (
  <NavItemContainer isSubchildActive={isSubchildActive}>
    <NavLinkContainer {...props}>{children}</NavLinkContainer>
    <motion.div layout animate={{ opacity: 1 }} initial={{ opacity: 0 }}>
      <AnimatePresence>
        {renderSibling}
      </AnimatePresence>
    </motion.div>
  </NavItemContainer>
);

export const NavLinkContainer = styled(NavLink) <LinkProps>`
  ${({ theme }) => css`
    color: ${theme.isDarkColor ? theme.colors.primaries['400'] : theme.colors.primaries['600']};
    padding: 8px 11px;
    display: flex;
    align-items: center;
    font-size: 0.8rem;

    /* For the icons */
    svg {
      margin-right: ${theme.gutter / 2}px;
      width: 24px;
      fill: ${theme.isDarkColor ? theme.colors.primaries['400'] : theme.colors.primaries['500']};

      .secondary {
        fill: ${theme.isDarkColor ? theme.colors.primaries['200'] : theme.colors.primaries['700']};
      }
    }

    &:hover {
      color: ${theme.isDarkColor ? theme.colors.primaries['200'] : theme.colors.primaries['700']};
    }

    /* If active react router */
    &.active {
      background: ${theme.colors.primaryGradient};
      border-radius: ${theme.borderRadiuses.somewhatRounded};
      color: white;

      svg {
        fill: white;
      }
    }
  `}
`;

export const NavItems = styled.div`
  ${({ theme }) => css`
    ul {
      list-style: none;

      ${NavItemContainer} + ${NavItemContainer} {
        margin-top: ${theme.gutter / 2}px;
      }
    }
  `}
`;

export const NavLogo = () => (
  <FullLogo />
);

export const UsernavContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const AvatarContainer = styled(Div)`
  ${({ theme }) => css`
    padding: ${theme.gutter}px;
    display: flex;
    align-items: center;
    justify-content: center;
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
          <Text>
            {t('english')}
          </Text>
        </ListItem>
        <ListItem onClick={switchToGerman}>
          <Text>
            {t('german')}
          </Text>
        </ListItem>
      </Div>
      <Div>
        {((user?.userCustomers?.length && user?.userCustomers.length > 1) || canAccessAdmin) && setActiveCustomer && (
          <ListItem renderLeftIcon={<ExternalLink />} onClick={goToDialoguesOverview}>
            <Text>
              {t('switch_project')}
            </Text>
          </ListItem>
        )}
        <ListItem renderLeftIcon={<LogOut />} onClick={logout}>
          <Text>
            {t('logout')}
          </Text>
        </ListItem>
      </Div>
    </List>
  );
};

export const Usernav = () => {
  const { user } = useUser();

  return (
    <UsernavContainer>
      <Dropdown renderOverlay={() => <UsernavDropdown />} placement="top-start" offset={[24, 0]}>
        {({ onOpen }) => (
          <AvatarContainer>
            <ChakraAvatar
              bg="gray.300"
              size="md"
              name={`${user?.firstName} ${user?.lastName}`}
              onClick={onOpen}
            >
              <AvatarBadge size="1em" bg="green.400" />
            </ChakraAvatar>
          </AvatarContainer>
        )}
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
    border-right: 1px solid ${theme.colors.gray['200']};

    /* background: ${theme.isDarkColor ? theme.colors.primary : theme.colors.primaries['700']}; */
    display: flex;
    height: 100vh;
    flex-direction: column;
    justify-content: space-between;
    
    ${FullLogoContainer} {
      color: ${theme.isDarkColor ? theme.colors.primaries['100'] : theme.colors.primaries['300']};
    }

    ${LogoContainer} {
      color: ${theme.colors.strongPrimary};

      svg {
        widht: 100%;
        height: 100%;
      }
    }
    
    ${LogoContainer} + ${UI.Text} {
      color: ${theme.colors.strongPrimary};
      font-weight: 900;
      font-size: 1.5rem;
    }

    ${NavItems} {
      padding-top: ${theme.gutter}px;
    }

    ul {
      a {
        text-decoration: none;

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
