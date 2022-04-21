import * as UI from '@haas/ui';
import { AnimateSharedLayout, motion } from 'framer-motion';
import { ArrowLeftCircle, ArrowRightCircle } from 'react-feather';
import { Div, PageHeading } from '@haas/ui';
import { ErrorBoundary } from 'react-error-boundary';
import { NavLink } from 'react-router-dom';
import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import React, { useState } from 'react';
import styled, { css } from 'styled-components';

import { ReactComponent as ChartIcon } from 'assets/icons/icon-chartbar.svg';
import { ReactComponent as ChatIcon } from 'assets/icons/icon-chat-group.svg';
import { ReactComponent as CursorClickIcon } from 'assets/icons/icon-cursorclick.svg';
import { CustomThemeProviders } from 'providers/ThemeProvider';
import { ReactComponent as HomeIcon } from 'assets/icons/icon-home.svg';
import { Loader } from 'components/Common/Loader/Loader';
import { NavItem, NavItems, SubMenuDropdown, Usernav } from 'components/Sidenav/Sidenav';
import { ReactComponent as NotificationIcon } from 'assets/icons/icon-notification.svg';
import { ReactComponent as SettingsIcon } from 'assets/icons/icon-cog.svg';
import { ReactComponent as SliderIcon } from 'assets/icons/icon-slider.svg';
import { ReactComponent as SurveyIcon } from 'assets/icons/icon-survey.svg';
import { ReactComponent as TableIcon } from 'assets/icons/icon-table.svg';
import { ReactComponent as UsersIcon } from 'assets/icons/icon-user-group.svg';
import { ReactComponent as WrenchIcon } from 'assets/icons/icon-wrench.svg';
import { useCustomer } from 'providers/CustomerProvider';
import { useNavigator } from 'hooks/useNavigator';
import Dropdown from 'components/Dropdown';
import Logo from 'components/Logo/Logo';
import MobileBottomNav from 'components/MobileBottomNav';
import Sidenav from 'components/Sidenav';
import useAuth from 'hooks/useAuth';
import useMediaDevice from 'hooks/useMediaDevice';

import NotAuthorizedView from './NotAuthorizedView';

const CustomerLayoutContainer = styled(Div) <{ isMobile?: boolean, isExpanded?: boolean }>`
  ${({ theme, isMobile = false, isExpanded }) => css`
    display: grid;
    background: ${theme.colors.app.background};
    min-height: 100vh;

    ${isMobile ? css`
      grid-template-columns: '1fr';
    ` : css`
      grid-template-columns: ${theme.sidenav.width}px 1fr;
    `}

    ${!isMobile && isExpanded && css`
      grid-template-columns: ${theme.sidenav.width}px 1fr;
    `}

    ${!isMobile && !isExpanded && css`
      grid-template-columns: 70px 1fr;
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

interface SubNavItemProps {
  isDisabled?: boolean;
}

const SubNavItem = styled.li<SubNavItemProps>`
  ${({ theme, isDisabled }) => css`
    a {
      font-size: 0.8rem;
      font-weight: 700;
      display: flex;
      align-items: center;
      margin: 0 ${theme.gutter / 2}px;
      color: ${theme.isDarkColor ? theme.colors.primaries[500] : theme.colors.primaries[800]};
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

    ${isDisabled && css`
      pointer-events: none;
      opacity: 0.3;
    `}
  `}
`;

const DashboardNav = ({ customerSlug, isExpanded }: { customerSlug: string, isExpanded: boolean }) => {
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
    <>
      <NavItems>
        <motion.ul>
          <AnimateSharedLayout>
            <NavItem
              isExpanded={isExpanded}
              to={`/dashboard/b/${customerSlug}/dashboard`}
            >
              <HomeIcon />
              {isExpanded && t('views:dashboard')}
            </NavItem>
            <NavItem
              style={{ padding: !isExpanded ? 0 : 'auto' }}
              isExpanded={isExpanded}
              isSubchildActive={!!dialogueSlug}
              exact
              to={`/dashboard/b/${customerSlug}/d`}
              renderSibling={(
                <>
                  {isExpanded && dialogueMatch && (
                    <motion.div>
                      <SubNav>
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
                        <SubNavItem isDisabled={!canBuildDialogues}>
                          <NavLink to={`/dashboard/b/${customerSlug}/d/${dialogueSlug}/actions`}>
                            <UI.Icon mr={2} as={CursorClickIcon} />
                            {t('views:cta_view')}
                          </NavLink>
                        </SubNavItem>
                        <SubNavItem isDisabled={!canBuildDialogues}>
                          <NavLink to={`/dashboard/b/${customerSlug}/d/${dialogueSlug}/builder`}>
                            <UI.Icon mr={2} as={WrenchIcon} />
                            {t('views:builder_view')}
                          </NavLink>
                        </SubNavItem>
                        <SubNavItem isDisabled={!canEditDialogue}>
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
              <Dropdown
                renderOverlay={({ onClose }) => <SubMenuDropdown onClose={onClose} />}
                placement="left-start"
                offset={[-2, 0]}
              >
                {({ onOpen }) => (
                  <Div
                    padding="8px 11px"
                    display="flex"
                    alignItems="center"
                    onMouseEnter={(e) => {
                      if (dialogueMatch && !isExpanded) {
                        onOpen(e);
                      }
                    }}
                    onClick={(e) => {
                      if (dialogueMatch && !isExpanded) {
                        onOpen(e);
                      }
                    }}
                  >
                    <SurveyIcon />
                    {isExpanded && t('dialogues')}
                  </Div>
                )}
              </Dropdown>

            </NavItem>
            <NavItem
              isExpanded={isExpanded}
              isDisabled={!canViewUsers}
              to={`/dashboard/b/${customerSlug}/users`}
            >
              <UsersIcon />
              {isExpanded && t('users')}
            </NavItem>
            <NavItem isExpanded={isExpanded} isDisabled={!canCreateTriggers} to={`/dashboard/b/${customerSlug}/triggers`}>
              <NotificationIcon />
              {isExpanded && t('alerts')}
            </NavItem>
            <NavItem isExpanded={isExpanded} isDisabled={!canViewCampaigns} to={`/dashboard/b/${customerSlug}/campaigns`}>
              <ChatIcon />
              {isExpanded && t('campaigns')}
            </NavItem>
            <NavItem isExpanded={isExpanded} isDisabled={!canEditCustomer} to={`/dashboard/b/${customerSlug}/edit`}>
              <SettingsIcon />
              {isExpanded && t('settings')}
            </NavItem>
          </AnimateSharedLayout>
        </motion.ul>
      </NavItems>
    </>
  );
};

const CornerLoaderPosition = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
`;

const ExpandArrowContainer = styled.div`
  position: absolute;
  cursor: pointer;

  right:-12px;
  top: 3em;
  border-radius: 45px;

  color:#d5dce6;

  :hover {
    color: #4A5568;
  }
  background-color: #EDF2F7;
`;

interface ExpandArrowProps {
  onExpandChange: (value: React.SetStateAction<boolean>) => void;
  isExpanded: boolean;
}

const ExpandArrow = ({ isExpanded, onExpandChange }: ExpandArrowProps) => {
  const handleExpandChange = () => {
    onExpandChange((prevValue) => {
      localStorage.setItem('nav_expanded', `${!prevValue}`);
      return !prevValue;
    });
  };

  return (
    <ExpandArrowContainer onClick={() => handleExpandChange()}>
      {isExpanded ? <ArrowLeftCircle /> : <ArrowRightCircle />}
    </ExpandArrowContainer>
  );
};

const CustomerLayout = ({ children }: { children: React.ReactNode }) => {
  const params: { topicId: string, customerSlug: string, dialogueSlug: string } = useParams<any>();
  const device = useMediaDevice();
  const { isLoading } = useCustomer();

  const [isExpanded, setIsExpanded] = useState<boolean>(
    JSON.parse(localStorage.getItem('nav_expanded') || 'false'),
  );

  return (
    <ErrorBoundary FallbackComponent={NotAuthorizedView}>
      <CustomThemeProviders>
        <CustomerLayoutContainer isExpanded={isExpanded} isMobile={device.isSmall}>

          {isLoading && (
            <CornerLoaderPosition>
              <Loader testId="runner" />
            </CornerLoaderPosition>
          )}
          <Div>
            {!device.isSmall ? (
              <motion.div initial={{ x: -30 }} animate={{ x: 0 }} exit={{ x: -30 }}>
                <Sidenav isExpanded={isExpanded}>
                  <Div pl={isExpanded ? 2 : 0} pr={isExpanded ? 2 : 0} paddingTop={2} position="relative">
                    <ExpandArrow isExpanded={isExpanded} onExpandChange={setIsExpanded} />
                    <UI.Flex alignItems="center">
                      <Logo width="70px" height="70px" justifyContent="center" />
                      {isExpanded && <UI.Text>haas</UI.Text>}
                    </UI.Flex>
                    <DashboardNav isExpanded={isExpanded} customerSlug={params.customerSlug} />
                  </Div>

                  <Usernav />
                </Sidenav>
              </motion.div>
            ) : (
              <MobileBottomNav>
                <DashboardNav isExpanded={isExpanded} customerSlug={params.customerSlug} />
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
