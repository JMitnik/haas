import * as RadixTooltip from '@radix-ui/react-tooltip';
import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';
import styled from 'styled-components';

import { slideUpFadeMotion } from 'components/animation/config';

const ContentContainer = styled(RadixTooltip.Content)`
  transform-origin: top left;
  z-index: 10000;
  width: 100%;
`;

export const { Root } = RadixTooltip;

export const { Trigger } = RadixTooltip;

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
        align="center"
        alignOffset={0}
        sideOffset={15}
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
