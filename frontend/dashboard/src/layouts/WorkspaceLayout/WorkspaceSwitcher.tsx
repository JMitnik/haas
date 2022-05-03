import * as Popover from '@radix-ui/react-popover';
import * as UI from '@haas/ui';
import { AnimatePresence, motion } from 'framer-motion';
import { Flag, LogOut, Settings, Sidebar } from 'react-feather';
import React from 'react';
import styled, { css } from 'styled-components';

import { Avatar } from 'components/Common/Avatar';
import { ReactComponent as SwitchIcon } from 'assets/icons/icon-switch.svg';
import { slideUpFadeMotion } from 'components/animation/config';
import { useCustomer } from 'providers/CustomerProvider';
import { useUser } from 'providers/UserProvider';

import * as LS from './WorkpaceLayout.styles';

const WorkspaceSwitcherContainer = styled(UI.Div)`
  ${({ theme }) => css`
    text-align: left;
    width: 100%;
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
  width: 100%;
`;

export const WorkspaceSwitcher = () => {
  const { user } = useUser();
  const { activeCustomer } = useCustomer();
  const [open, setOpen] = React.useState(false);

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger style={{ width: '100%' }}>
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
            portalled={false}
            {...slideUpFadeMotion}
            style={{ minWidth: '320px' }}
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
                          {activeCustomer.name}
                          {' '}
                          as
                          {' '}
                          {activeCustomer.userRole?.name}
                        </UI.Muted>
                      )}
                    </UI.Div>
                  </UI.Flex>
                </LS.Item>

                <UI.Hr />

                <LS.Item>
                  <UI.Icon>
                    <Flag />
                  </UI.Icon>
                  Switch to German
                </LS.Item>

                <LS.Item>
                  <UI.Icon>
                    <Flag />
                  </UI.Icon>
                  Switch to English
                </LS.Item>

                <UI.Hr />

                <LS.Item>

                  <UI.Icon>
                    <Settings />
                  </UI.Icon>
                  Account settings
                </LS.Item>

                <LS.Item>
                  <UI.Icon>
                    <Sidebar />
                  </UI.Icon>
                  Change workspace
                </LS.Item>

                <LS.Item>
                  <UI.Icon>
                    <LogOut />
                  </UI.Icon>
                  Logout
                </LS.Item>
              </LS.Card>
            </motion.div>
          </Content>
        ) : null}
      </AnimatePresence>
    </Popover.Root>
  );
};
