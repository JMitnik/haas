import * as UI from '@haas/ui';
import { AnimatePresence, AnimateSharedLayout, motion } from 'framer-motion';
import { LinkProps, NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import React from 'react';
import styled, { css } from 'styled-components';

import { ReactComponent as ChartIcon } from 'assets/icons/icon-chartbar.svg';
import { ReactComponent as ChatIcon } from 'assets/icons/icon-chat-group-sm.svg';
import { ReactComponent as CursorClickIcon } from 'assets/icons/icon-cursorclick.svg';
import { ReactComponent as HomeIcon } from 'assets/icons/icon-home-sm.svg';
import { ReactComponent as NotificationIcon } from 'assets/icons/icon-notification-sm.svg';
import { ReactComponent as SettingsIcon } from 'assets/icons/icon-cog-sm.svg';
import { ReactComponent as SliderIcon } from 'assets/icons/icon-slider.svg';
import { ReactComponent as SurveyIcon } from 'assets/icons/icon-survey-sm.svg';
import { ReactComponent as TableIcon } from 'assets/icons/icon-table.svg';
import { ReactComponent as UsersIcon } from 'assets/icons/icon-user-group-sm.svg';
import { ReactComponent as WrenchIcon } from 'assets/icons/icon-wrench.svg';
import { useNavigator } from 'hooks/useNavigator';
import useAuth from 'hooks/useAuth';

import * as LS from './WorkpaceLayout.styles';

interface NavItemContainerProps {
  isSubchildActive?: boolean;
}

export const NavItemContainer = styled.li<NavItemContainerProps>`
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
    @media print {
      display: none;
    }
  `}
`;

interface NavLinkProps extends LinkProps {
  // Styled-components does not pass props with a dollar sign to the underlying element.
  $isDisabled?: boolean;
}

export const NavLinkContainer = styled(NavLink) <NavLinkProps>`
  ${({ $isDisabled }) => css`
    display: flex;
    align-items: center;

    ${$isDisabled && css`
      opacity: 0.3;
      pointer-events: none;
      cursor: not-allowed;
    `}
  `}
`;

interface NavItemProps extends LinkProps {
  renderSibling?: React.ReactNode;
  exact?: boolean;
  isSubchildActive?: boolean;
  isDisabled?: boolean;
}

export const NavItem = ({ children, renderSibling, isDisabled, isSubchildActive, ...props }: NavItemProps) => (
  <NavItemContainer isSubchildActive={isSubchildActive}>
    <NavLinkContainer $isDisabled={isDisabled} {...props}>
      {children}
    </NavLinkContainer>
    {!isDisabled && (
      <motion.div layout animate={{ opacity: 1 }} initial={{ opacity: 0 }}>
        <AnimatePresence>
          {renderSibling}
        </AnimatePresence>
      </motion.div>
    )}
  </NavItemContainer>
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
                          <UI.Icon mr={2} as={ChartIcon} />
                          {t('views:dialogue_view')}
                        </NavLink>
                      </LS.SubNavItem>
                      <LS.SubNavItem>
                        <NavLink to={`/dashboard/b/${customerSlug}/d/${dialogueSlug}/interactions`}>
                          <UI.Icon mr={2} as={TableIcon} />
                          {t('views:interactions_view')}
                        </NavLink>
                      </LS.SubNavItem>
                      <LS.SubNavItem isDisabled={!canBuildDialogues}>
                        <NavLink to={`/dashboard/b/${customerSlug}/d/${dialogueSlug}/actions`}>
                          <UI.Icon mr={2} as={CursorClickIcon} />
                          {t('views:cta_view')}
                        </NavLink>
                      </LS.SubNavItem>
                      <LS.SubNavItem isDisabled={!canBuildDialogues}>
                        <NavLink to={`/dashboard/b/${customerSlug}/d/${dialogueSlug}/builder`}>
                          <UI.Icon mr={2} as={WrenchIcon} />
                          {t('views:builder_view')}
                        </NavLink>
                      </LS.SubNavItem>
                      <LS.SubNavItem isDisabled={!canEditDialogue}>
                        <NavLink to={`/dashboard/b/${customerSlug}/d/${dialogueSlug}/edit`}>
                          <UI.Icon mr={2} as={SliderIcon} />
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
          <NavItem isDisabled={!canEditCustomer} to={`/dashboard/b/${customerSlug}/edit`}>
            <SettingsIcon />
            {t('settings')}
          </NavItem>
        </AnimateSharedLayout>
      </motion.ul>
    </LS.NavItems>
  );
};
