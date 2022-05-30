import * as Popover from '@radix-ui/react-popover';
import * as UI from '@haas/ui';
import { AnimatePresence, motion } from 'framer-motion';
import { LogOut, Settings, Sidebar } from 'react-feather';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import React from 'react';
import styled, { css } from 'styled-components';

import { Avatar } from 'components/Common/Avatar';
import { ReactComponent as GermanyFlag } from 'assets/images/de.svg';
import { ReactComponent as SwitchIcon } from 'assets/icons/icon-switch.svg';
import { ReactComponent as UKFlag } from 'assets/images/uk.svg';
import { slideUpFadeMotion } from 'components/animation/config';
import { useCustomer } from 'providers/CustomerProvider';
import { useUser } from 'providers/UserProvider';

import * as LS from './WorkpaceLayout.styles';

export const WorkspaceSwitcherContainer = styled(UI.Div)`
  ${({ theme }) => css`
    text-align: left;
    width: 100%;
    position: relative;
    padding: ${theme.gutter}px;
    border-top: 1px solid ${theme.colors.gray[200]};
    border-right: 1px solid ${theme.colors.neutral[500]};
    transition: all ${theme.transitions.slow};

    &:hover {
      background: ${theme.colors.off[100]};
      transition: all ${theme.transitions.slow};

      cursor: pointer;
    }

    ${UI.Icon} svg path {
      stroke: currentColor;
    }
  `}
`;

const Content = styled(Popover.Content)`
  transform-origin: top left;
  z-index: 10000;
  width: 100%;
`;

export const WorkspaceSwitcher = () => {
  const { user, logout } = useUser();
  const { activeCustomer, setActiveCustomer } = useCustomer();
  const [open, setOpen] = React.useState(false);
  const history = useHistory();

  const { t, i18n } = useTranslation();

  const goToWorkspaceOverview = () => {
    setActiveCustomer(null);
    history.push('/dashboard');
  };

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger style={{ width: '100%', zIndex: 1000 }}>
        <WorkspaceSwitcherContainer>
          <UI.Flex alignItems="center" justifyContent="space-between">
            <UI.Flex alignItems="center">
              <UI.Div>
                <Avatar
                  name={user?.firstName || 'N'}
                  brand="main"
                />
              </UI.Div>
              <UI.Div ml={2}>
                <UI.Strong color="off.600">
                  {user?.firstName}
                </UI.Strong>
                <UI.Muted>
                  {activeCustomer?.name}
                </UI.Muted>
              </UI.Div>
            </UI.Flex>

            <UI.Div>
              <UI.Icon fontSize="0.2rem" color="off.500">
                <SwitchIcon width="1rem" />
              </UI.Icon>
            </UI.Div>
          </UI.Flex>
        </WorkspaceSwitcherContainer>
      </Popover.Trigger>

      <AnimatePresence>
        {open ? (
          <Content
            asChild
            forceMount
            forwardedAs={motion.div}
            align="start"
            alignOffset={12}
            side="bottom"
            {...slideUpFadeMotion}
            style={{ minWidth: '320px', zIndex: 10000 }}
          >
            <motion.div>
              <LS.Card>
                <LS.Item>
                  <UI.Flex alignItems="center">
                    <UI.Div>
                      <Avatar
                        name={user?.firstName || 'N'}
                        brand="main"
                      />
                    </UI.Div>
                    <UI.Div ml={2}>
                      <UI.Strong color="off.600">
                        {user?.firstName}
                        {' '}
                        {user?.lastName}
                      </UI.Strong>
                      {activeCustomer && (
                        <UI.Muted>
                          {t('workspace_role', { workspace: activeCustomer.name, role: activeCustomer.userRole?.name })}
                        </UI.Muted>
                      )}
                    </UI.Div>
                  </UI.Flex>
                </LS.Item>

                <UI.Hr />

                <LS.CheckedItem
                  onClick={() => i18n.changeLanguage('en')}
                  isChecked={i18n.language === 'en'}
                >
                  <UI.Flex alignItems="center">
                    <UI.Icon>
                      <UKFlag />
                    </UI.Icon>
                    {t('to_language_en')}
                  </UI.Flex>
                </LS.CheckedItem>

                <LS.CheckedItem
                  onClick={() => i18n.changeLanguage('de')}
                  isChecked={i18n.language === 'de'}
                >
                  <UI.Flex alignItems="center">
                    <UI.Icon>
                      <GermanyFlag />
                    </UI.Icon>
                    {t('to_language_de')}
                  </UI.Flex>
                </LS.CheckedItem>

                <UI.Hr />

                <LS.NavItem to="/dashboard/me/edit">
                  <UI.Icon>
                    <Settings />
                  </UI.Icon>
                  {t('account_settings')}
                </LS.NavItem>

                <LS.Item onClick={goToWorkspaceOverview}>
                  <UI.Icon>
                    <Sidebar />
                  </UI.Icon>
                  {t('switch_workspace')}
                </LS.Item>

                <LS.Item onClick={logout}>
                  <UI.Icon>
                    <LogOut />
                  </UI.Icon>
                  {t('logout')}
                </LS.Item>
              </LS.Card>
            </motion.div>
          </Content>
        ) : null}
      </AnimatePresence>
    </Popover.Root>
  );
};
