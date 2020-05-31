import { useObserver } from 'mobx-react-lite';
import { useParams } from 'react-router-dom';
import React, { memo } from 'react';

import { HAASNode } from 'types/generic';
import { motion } from 'framer-motion';
import Loader from 'components/Loader';
// import NodeView from 'views/NodeView';
import useDialogueTree from 'providers/DialogueTreeProvider';

export interface GenericNodeProps {
  isLeaf?: boolean;
  node: HAASNode;
}

const NodePage = () => {
  const { edgeId } = useParams<{ edgeId?: string, leafId?: string }>();
  const store = useDialogueTree();

  console.log(store);

  return useObserver(() => (
    <div>
      See test
    </div>
    // <NodeView node={activeNode} />
  ));
};

export default NodePage;
