import * as UI from '@haas/ui';
import { AnimatePresence, AnimateSharedLayout, motion } from 'framer-motion';
import { LinkProps } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import React from 'react';

import { ReactComponent as CPUIcon } from 'assets/icons/icon-cpu-sm.svg';
import { ReactComponent as ChatIcon } from 'assets/icons/icon-chat-group-sm.svg';
import { ReactComponent as HomeIcon } from 'assets/icons/icon-view-grid-sm.svg';
import { ReactComponent as SettingsIcon } from 'assets/icons/icon-cog-sm.svg';
import { ReactComponent as SurveyIcon } from 'assets/icons/icon-survey-sm.svg';
import { ReactComponent as UsersIcon } from 'assets/icons/icon-user-group-sm.svg';
import { useNavigator } from 'hooks/useNavigator';
import useAuth from 'hooks/useAuth';

import * as LS from './WorkpaceLayout.styles';

interface NavItemProps extends LinkProps {
  renderSibling?: React.ReactNode;
  exact?: boolean;
  isSubchildActive?: boolean;
  isDisabled?: boolean;
}

export const NavItem = ({ children, renderSibling, isDisabled, isSubchildActive, ...props }: NavItemProps) => (
  <LS.NavItemContainer isSubchildActive={isSubchildActive}>
    <LS.NavLinkContainer $isDisabled={isDisabled} {...props}>
      {children}
    </LS.NavLinkContainer>
    {!isDisabled && (
      <motion.div layout animate={{ opacity: 1 }} initial={{ opacity: 0 }}>
        <AnimatePresence>
          {renderSibling}
        </AnimatePresence>
      </motion.div>
    )}
  </LS.NavItemContainer>
);

export const WorkspaceNav = ({ customerSlug }: { customerSlug: string }) => {
  const { t } = useTranslation();
  const {
    canViewUsers,
    canEditCustomer,
    canViewCampaigns,
    canViewAutomations,
  } = useAuth();
  const { dialogueMatch } = useNavigator();
  const dialogueSlug = dialogueMatch?.params?.dialogueSlug;

  return (
    <LS.NavItems>
      <motion.ul layout>
        <AnimateSharedLayout>
          <NavItem
            to={`/dashboard/b/${customerSlug}/dashboard`}
          >
            <HomeIcon />
            {t('views:dashboard')}
          </NavItem>
          <NavItem
            isSubchildActive={!!dialogueSlug}
            to={`/dashboard/b/${customerSlug}/d`}
          >
            <SurveyIcon />
            {t('teams')}
          </NavItem>
          <NavItem isDisabled={!canViewUsers} to={`/dashboard/b/${customerSlug}/users`}>
            <UsersIcon />
            {t('users')}
          </NavItem>
          <NavItem isDisabled={!canViewCampaigns} to={`/dashboard/b/${customerSlug}/campaigns`}>
            <ChatIcon />
            {t('campaigns')}
          </NavItem>
          <NavItem isDisabled={!canViewAutomations} to={`/dashboard/b/${customerSlug}/automations`}>
            <CPUIcon />
            {t('automations')}
          </NavItem>
        </AnimateSharedLayout>
      </motion.ul>

      <UI.Hr />

      <motion.ul>
        <NavItem isDisabled={!canEditCustomer} to={`/dashboard/b/${customerSlug}/edit`}>
          <SettingsIcon />
          {t('settings')}
        </NavItem>
      </motion.ul>
    </LS.NavItems>
  );
};
