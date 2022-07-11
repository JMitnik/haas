import { motion } from 'framer-motion';
import React from 'react';

import { NodeContainer } from './NodeLayoutStyles';

const NodeLayout = ({ children }: { children: React.ReactNode }) => (
  <NodeContainer
    as={motion.div}
    transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.4 }}
    exit={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    initial={{ opacity: 0 }}
  >
    {children}
  </NodeContainer>
);

export default NodeLayout;
