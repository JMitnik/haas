import * as DialogPrimitive from '@radix-ui/react-dialog';
import * as UI from '@haas/ui';
import { AnimatePresence, motion } from 'framer-motion';

import { slideUpFadeMotion } from 'modules/animation/config';
import React from 'react';
import styled from 'styled-components';

interface RootProps extends DialogPrimitive.DialogContentProps {
  children: React.ReactNode;
  open: boolean;
  onClose: () => void;
  minWidth?: number;
  onOpenChange?: (open: boolean) => void;
}

const RootContainer = styled(DialogPrimitive.Root)``;

const ContentContainer = styled(DialogPrimitive.Content)`
  max-width: 80%;
  min-height: 300px;
  max-height: 85vh;
`;

const Overlay = styled(DialogPrimitive.DialogOverlay)`
  background-color: rgba(0, 0, 0, 0.2);
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 0;
  overflow-y: auto;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10000;
`;

const CustomDiv = motion(styled.div``);

export const Root = ({ children, open, onClose, minWidth = 600, ...props }: RootProps) => (
  <RootContainer
    open={open}
    onOpenChange={onClose}
    {...slideUpFadeMotion}
  >
    <AnimatePresence>
      {open ? (
        <DialogPrimitive.Portal forceMount>
          <Overlay
            key="overlay"
            asChild
            forceMount
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: [0, 0, 0.2, 1] }}
            >
              <ContentContainer
                forceMount
                asChild
                forwardedAs={CustomDiv}
                {...props}
              >
                <motion.div
                  key="content"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, ease: [0, 0, 0.2, 1] }}
                >
                  <UI.Card minWidth={[300, 300, minWidth]} minHeight={300}>
                    {children}
                  </UI.Card>
                </motion.div>
              </ContentContainer>
            </motion.div>
          </Overlay>
        </DialogPrimitive.Portal>
      ) : null}
    </AnimatePresence>
  </RootContainer>
);
