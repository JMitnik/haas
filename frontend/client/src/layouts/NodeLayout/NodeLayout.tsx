import React from 'react';

import { NodeContainer } from './NodeLayoutStyles';

const NodeLayout = ({ children }: { children: React.ReactNode }) => (
  <NodeContainer>
    {children}
  </NodeContainer>
);

export default NodeLayout;
