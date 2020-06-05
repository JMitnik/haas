import { AnimatePresence, motion } from 'framer-motion';
import React, { ReactNode } from 'react';

import { HAASNode } from 'types/generic';
import { TreeNodeProps } from 'models/Tree/TreeNodeModel';

import { ActiveNodeContainer, FloatingNodeContainer } from './NodeStyles';

export interface GenericNodeProps {
  onEntryStore: (entry: any, edgeKey: any) => void;
  node: TreeNodeProps;
}

const NodeLayout = ({ activeNode, children }: { activeNode: HAASNode, children: ReactNode }) => (
  <>
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
  </>
);

export default NodeLayout;
