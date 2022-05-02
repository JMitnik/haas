import * as UI from '@haas/ui';
import { AnimatePresence, AnimateSharedLayout, motion } from 'framer-motion';
import { LinkProps, NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import React from 'react';

import { ReactComponent as ChatIcon } from 'assets/icons/icon-chat-group-sm.svg';
import { ReactComponent as HomeIcon } from 'assets/icons/icon-home-sm.svg';
import { ReactComponent as NotificationIcon } from 'assets/icons/icon-notification-sm.svg';
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
    canCreateTriggers,
    canViewCampaigns,
    canBuildDialogues,
    canEditDialogue,
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
            exact
            to={`/dashboard/b/${customerSlug}/d`}
            renderSibling={(
              <>
                {dialogueMatch && (
                  <motion.div>
                    <LS.SubNav>
                      <LS.SubNavItem>
                        <NavLink exact strict to={`/dashboard/b/${customerSlug}/d/${dialogueSlug}`}>
                          {t('views:dialogue_view')}
                        </NavLink>
                      </LS.SubNavItem>
                      <LS.SubNavItem>
                        <NavLink to={`/dashboard/b/${customerSlug}/d/${dialogueSlug}/interactions`}>
                          {t('views:interactions_view')}
                        </NavLink>
                      </LS.SubNavItem>
                      <LS.SubNavItem isDisabled={!canBuildDialogues}>
                        <NavLink to={`/dashboard/b/${customerSlug}/d/${dialogueSlug}/actions`}>
                          {t('views:cta_view')}
                        </NavLink>
                      </LS.SubNavItem>
                      <LS.SubNavItem isDisabled={!canBuildDialogues}>
                        <NavLink to={`/dashboard/b/${customerSlug}/d/${dialogueSlug}/builder`}>
                          {t('views:builder_view')}
                        </NavLink>
                      </LS.SubNavItem>
                      <LS.SubNavItem isDisabled={!canEditDialogue}>
                        <NavLink to={`/dashboard/b/${customerSlug}/d/${dialogueSlug}/edit`}>
                          {t('views:configurations')}
                        </NavLink>
                      </LS.SubNavItem>
                    </LS.SubNav>
                  </motion.div>
                )}
              </>
            )}
          >
            <SurveyIcon />
            {t('dialogues')}
          </NavItem>
          <NavItem isDisabled={!canViewUsers} to={`/dashboard/b/${customerSlug}/users`}>
            <UsersIcon />
            {t('users')}
          </NavItem>
          <NavItem isDisabled={!canCreateTriggers} to={`/dashboard/b/${customerSlug}/triggers`}>
            <NotificationIcon />
            {t('alerts')}
          </NavItem>
          <NavItem isDisabled={!canViewCampaigns} to={`/dashboard/b/${customerSlug}/campaigns`}>
            <ChatIcon />
            {t('campaigns')}
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
