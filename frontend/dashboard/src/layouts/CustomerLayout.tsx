import * as UI from '@haas/ui';
import { useParams, useRouteMatch } from 'react-router';
import React from 'react';
import styled, { css } from 'styled-components';

import { AnimatePresence, AnimateSharedLayout, motion } from 'framer-motion';
import { ReactComponent as ChartIcon } from 'assets/icons/icon-chartbar.svg';
import { ReactComponent as ChatIcon } from 'assets/icons/icon-chat-group.svg';
import { ReactComponent as CursorClickIcon } from 'assets/icons/icon-cursorclick.svg';
import { CustomThemeProviders } from 'providers/ThemeProvider';
import { Div, PageHeading } from '@haas/ui';
import { ErrorBoundary } from 'react-error-boundary';
import { NavItem, NavItems, Usernav } from 'components/Sidenav/Sidenav';
import { ReactComponent as NotificationIcon } from 'assets/icons/icon-notification.svg';
import { ReactComponent as SettingsIcon } from 'assets/icons/icon-cog.svg';
import { ReactComponent as SliderIcon } from 'assets/icons/icon-slider.svg';
import { ReactComponent as SurveyIcon } from 'assets/icons/icon-survey.svg';
import { ReactComponent as TableIcon } from 'assets/icons/icon-table.svg';
import { ReactComponent as UsersIcon } from 'assets/icons/icon-user-group.svg';

import { ReactComponent as WrenchIcon } from 'assets/icons/icon-wrench.svg';
import { ReactComponent as ZapIcon } from 'assets/icons/icon-zap.svg';
import { useTranslation } from 'react-i18next';
import Logo from 'components/Logo/Logo';
import MobileBottomNav from 'components/MobileBottomNav';
import Sidenav from 'components/Sidenav';
import useAuth from 'hooks/useAuth';
import useMediaDevice from 'hooks/useMediaDevice';

import { Activity, BarChart, Mail, Zap } from 'react-feather';
import { NavLink } from 'react-router-dom';
import { ensureLightColor } from 'utils/ColorUtils';
import { useDialogue } from 'providers/DialogueProvider';
import { useNavigator } from 'hooks/useNavigator';
import NotAuthorizedView from './NotAuthorizedView';

const CustomerLayoutContainer = styled(Div)<{ isMobile?: boolean }>`
  ${({ theme, isMobile = false }) => css`
    display: grid;
    background: ${theme.colors.app.background};
    min-height: 100vh;

    ${isMobile ? css`
      grid-template-columns: '1fr';      
    ` : css`
      grid-template-columns: ${theme.sidenav.width}px 1fr;
    `}
    
  `}
`;

const DashboardViewContainer = styled(Div)`
  ${({ theme }) => css`
    ${PageHeading} {
      color: ${theme.colors.app.onDefault};
    }
  `}
`;

const SubNav = styled.ul`
  ${({ theme }) => css`
    border-radius: 0 0 5px 5px;
    padding: 12px 0;
    background: ${theme.colors.gray[100]};
    border-top: 1px solid ${theme.colors.gray[200]};
  `}
`;

const SubNavItem = styled.li`
  ${({ theme }) => css`
    a {
      font-size: 0.8rem;
      font-weight: 700;
      display: flex;
      align-items: center;
      margin: 0 ${theme.gutter / 2}px;
      color: ${theme.colors.primaries[500]};
      padding: 4px 12px ;
    }

    svg {
      width: 12px;
    }

    > a.active {
      color: white;
      background: ${theme.colors.primaryGradient};
      border-radius: ${theme.borderRadiuses.somewhatRounded};
    }
  `}
`;

const DashboardNav = ({ customerSlug }: { customerSlug: string }) => {
  const { t } = useTranslation();
  const { canViewUsers, canEditCustomer, canCreateTriggers } = useAuth();
  const { dialogueMatch, dialoguesMatch } = useNavigator();
  const { activeDialogue } = useDialogue();
  const dialogueSlug = dialogueMatch?.params?.dialogueSlug;

  return (
    <NavItems>
      <motion.ul layout>
        <AnimateSharedLayout>
          <NavItem
            isSubchildActive={!!dialogueSlug}
            exact
            to={`/dashboard/b/${customerSlug}/d`}
            renderSibling={(
              <>
                {dialogueMatch && (
                  <motion.div>
                    <SubNav>
                      {/* <li>
                        <UI.Label size="sm" fontSize="0.5rem" variantColor="gray">
                          {activeDialogue?.title}
                        </UI.Label>
                      </li> */}
                      <SubNavItem>
                        <NavLink exact strict to={`/dashboard/b/${customerSlug}/d/${dialogueSlug}`}>
                          <UI.Icon mr={2} as={ChartIcon} />
                          {t('views:dialogue_view')}
                        </NavLink>
                      </SubNavItem>
                      <SubNavItem>
                        <NavLink to={`/dashboard/b/${customerSlug}/d/${dialogueSlug}/interactions`}>
                          <UI.Icon mr={2} as={TableIcon} />
                          {t('views:interactions_view')}
                        </NavLink>
                      </SubNavItem>
                      <SubNavItem>
                        <NavLink to={`/dashboard/b/${customerSlug}/d/${dialogueSlug}/actions`}>
                          <UI.Icon mr={2} as={CursorClickIcon} />
                          {t('views:cta_view')}
                        </NavLink>

                      </SubNavItem>
                      <SubNavItem>
                        <NavLink to={`/dashboard/b/${customerSlug}/d/${dialogueSlug}/builder`}>
                          <UI.Icon mr={2} as={WrenchIcon} />
                          {t('views:builder_view')}
                        </NavLink>
                      </SubNavItem>
                      <SubNavItem>
                        <NavLink to={`/dashboard/b/${customerSlug}/d/${dialogueSlug}/edit`}>
                          <UI.Icon mr={2} as={SliderIcon} />
                          {t('views:configurations')}
                        </NavLink>
                      </SubNavItem>
                    </SubNav>
                  </motion.div>
                )}
              </>
            )}
          >
            <SurveyIcon />
            {t('dialogues')}
          </NavItem>
          {canViewUsers && (
            <NavItem to={`/dashboard/b/${customerSlug}/users`}>
              <UsersIcon />
              {t('users')}
            </NavItem>
          )}
          {canCreateTriggers && (
            <NavItem to={`/dashboard/b/${customerSlug}/triggers`}>
              <NotificationIcon />
              {t('alerts')}
            </NavItem>
          )}
          <NavItem to={`/dashboard/b/${customerSlug}/campaigns`}>
            <ChatIcon />
            {t('campaigns')}
          </NavItem>
          {canEditCustomer && (
            <NavItem to={`/dashboard/b/${customerSlug}/edit`}>
              <SettingsIcon />
              {t('settings')}
            </NavItem>
          )}
        </AnimateSharedLayout>
      </motion.ul>
    </NavItems>
  );
};

const CustomerLayout = ({ children }: { children: React.ReactNode }) => {
  const params: { topicId: string, customerSlug: string, dialogueSlug: string } = useParams<any>();
  const device = useMediaDevice();

  return (
    <ErrorBoundary FallbackComponent={NotAuthorizedView}>
      <CustomThemeProviders>

        <CustomerLayoutContainer isMobile={device.isSmall}>
          <Div>
            {!device.isSmall ? (
              <motion.div initial={{ x: -30 }} animate={{ x: 0 }} exit={{ x: -30 }}>
                <Sidenav>
                  <Div padding={2}>
                    <UI.Flex alignItems="center">
                      <Logo width="60px" height="60px" justifyContent="center" />
                      <UI.Text>haas</UI.Text>
                    </UI.Flex>
                    <DashboardNav customerSlug={params.customerSlug} />
                  </Div>

                  <Usernav />
                </Sidenav>
              </motion.div>
            ) : (
              <MobileBottomNav>
                <DashboardNav customerSlug={params.customerSlug} />
              </MobileBottomNav>
            )}
          </Div>

          <DashboardViewContainer>
            {children}
          </DashboardViewContainer>
        </CustomerLayoutContainer>
      </CustomThemeProviders>
    </ErrorBoundary>
  );
};

export default CustomerLayout;
