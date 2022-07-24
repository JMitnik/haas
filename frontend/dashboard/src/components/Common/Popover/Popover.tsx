import * as RadixPopover from '@radix-ui/react-popover';
import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';
import styled from 'styled-components';

import { slideUpFadeMotion } from 'components/animation/config';

const ContentContainer = styled(RadixPopover.Content)`
  transform-origin: top left;
  z-index: 10000;
  width: 100%;
`;

export const { Root } = RadixPopover;

export const { Trigger } = RadixPopover;

interface ContentProps {
  isOpen: boolean;
  children: React.ReactNode;
  portalled?: boolean;
  style?: React.CSSProperties;
}

export const Content = ({ isOpen, children, portalled, style }: ContentProps) => (
  <AnimatePresence>
    {isOpen ? (
      <ContentContainer
        asChild
        forceMount
        forwardedAs={motion.div}
        align="start"
        alignOffset={12}
        side="bottom"
        portalled={portalled}
        {...slideUpFadeMotion}
        style={style}
      >
        <motion.div>
          {children}
        </motion.div>
      </ContentContainer>
    ) : null}
  </AnimatePresence>
);
