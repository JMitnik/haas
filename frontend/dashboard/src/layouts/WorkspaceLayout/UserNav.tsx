import { AvatarBadge, Badge, Button, Avatar as ChakraAvatar, useToast } from '@chakra-ui/core';
import { Book, ExternalLink, LogOut } from 'react-feather';
import { Div, Flex, Text } from '@haas/ui';
import { Link, useHistory } from 'react-router-dom';
import React from 'react';
import styled, { css } from 'styled-components';

import { useCustomer } from 'providers/CustomerProvider';
import { useTranslation } from 'react-i18next';
import { useUser } from 'providers/UserProvider';
import Dropdown from 'components/Dropdown';
import List from 'components/List/List';
import ListItem from 'components/List/ListItem';
import useAuth from 'hooks/useAuth';

export const UsernavContainer = styled.div`
display: flex;
align-items: center;
justify-content: center;
`;

export const AvatarContainer = styled(Div)`
${({ theme }) => css`
  /* padding: ${theme.gutter}px; */
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

  const goToAutodeckOverview = () => {
    history.push('/dashboard/autodeck-overview');
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
        {((canAccessAdmin) && (
          <ListItem renderLeftIcon={<Book />} onClick={goToAutodeckOverview}>
            <Text>Autodeck Overview</Text>
          </ListItem>
        ))}
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
    <UsernavContainer id="usernav">
      <Dropdown renderOverlay={() => <UsernavDropdown />} placement="top-start" offset={[24, 0]}>
        {({ onOpen }) => (
          <AvatarContainer>
            <ChakraAvatar
              size="sm"
              bg="main.500"
              // size="md"
              name={`${user?.firstName} ${user?.lastName}`}
              onClick={onOpen}
            />
          </AvatarContainer>
        )}
      </Dropdown>
    </UsernavContainer>
  );
};
