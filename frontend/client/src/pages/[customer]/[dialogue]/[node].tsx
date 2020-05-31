import { observer, useObserver } from 'mobx-react-lite';
import { useParams } from 'react-router-dom';
import React from 'react';

import { HAASNode } from 'types/generic';
import { Variants, motion } from 'framer-motion';
import Loader from 'components/Loader';
// import NodeView from 'views/NodeView';
import NodeView from 'views/NodeView';
import useDialogueTree from 'providers/DialogueTreeProvider';

export interface GenericNodeProps {
  isLeaf?: boolean;
  node: HAASNode;
}

const nodeViewAnimation: Variants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
  },
  exit: {
    opacity: 0,
  },
};

const NodePage = observer(() => {
  const { edgeId } = useParams<{ edgeId?: string, leafId?: string }>();
  const store = useDialogueTree();

  return useObserver(() => {
    if (!store.tree.rootNode) {
      return <Loader />;
    }

    const node = edgeId ? store.tree.getChildNodeByEdge(edgeId) : store.tree.rootNode;

    return (
      <motion.div
        style={{ width: '100%' }}
        variants={nodeViewAnimation}
        initial="initial"
        animate="animate"
        exit="exit"
        key={edgeId}
      >
        <NodeView node={node} />
      </motion.div>
    );
  });
});

export default NodePage;
