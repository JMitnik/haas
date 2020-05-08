import React, { ReactNode } from 'react';
import { HAASNode } from 'types/generic';
import { motion, AnimatePresence } from 'framer-motion';
import { ActiveNodeContainer, FloatingNodeContainer } from './NodeStyles';

export interface GenericNodeProps {
  isLeaf?: boolean;
  node: HAASNode;
}

const NodeLayout = ({ activeNode, children }: { activeNode: HAASNode, children: ReactNode } ) => {
  return (
    <>
      <AnimatePresence>
        <FloatingNodeContainer key={activeNode?.id}>
          <motion.div
            key={activeNode?.id}
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            style={{ display: 'flex', width: '100%' }}
          >
            <ActiveNodeContainer>
              {children}
            </ActiveNodeContainer>
          </motion.div>
        </FloatingNodeContainer>
      </AnimatePresence>
    </>
  );
};

export default NodeLayout;
