import * as Popover from '@radix-ui/react-popover';
import * as UI from '@haas/ui';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useState } from 'react';
import styled from 'styled-components';

import { ReactComponent as HamburgerIcon } from 'assets/icons/icon-hamburger.svg';
import { slideUpFadeMotion } from 'components/animation/config';
import { useCustomer } from 'providers/CustomerProvider';

import { WorkspaceNav } from './WorkspaceNav';
import { WorkspaceSwitchContent } from './WorkspaceSwitcher';

const Content = styled(Popover.Content)`
  transform-origin: top left;
  z-index: 100000;
  width: 100%;
`;

const HamburgerContainer = styled(UI.Div)`
  width: 100%;
`;

export const TopbarHamburger = () => {
  const { activeCustomer } = useCustomer();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <HamburgerContainer className="hamburger" px={4}>
      <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
        <Popover.Trigger asChild>
          <UI.Button variant="outline">
            <UI.Icon>
              <HamburgerIcon />
            </UI.Icon>
          </UI.Button>
        </Popover.Trigger>

        <AnimatePresence>
          {isOpen ? (
            <Content
              asChild
              forceMount
              forwardedAs={motion.div}
              align="start"
              alignOffset={12}
              side="bottom"
              portalled={false}
              {...slideUpFadeMotion}
              style={{ width: '100%', minWidth: '80%', zIndex: 10000 }}
            >
              <motion.div>
                <UI.NewCard>
                  <UI.CardBody>
                    <WorkspaceNav customerSlug={activeCustomer?.slug || ''} />

                    <UI.Hr />

                    <WorkspaceSwitchContent />

                  </UI.CardBody>
                </UI.NewCard>
              </motion.div>
            </Content>
          ) : null}
        </AnimatePresence>
      </Popover.Root>
    </HamburgerContainer>
  );
};
