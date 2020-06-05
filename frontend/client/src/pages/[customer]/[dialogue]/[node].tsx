import { Variants, motion } from 'framer-motion';
import { observer, useObserver } from 'mobx-react-lite';
import { useParams } from 'react-router-dom';
import React from 'react';

import { HAASNode } from 'types/generic';
import Loader from 'components/Loader';
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
    // If rootNode is unknown yet, return Loader
    if (!store.tree) {
      return <Loader />;
    }

    // Either we start from the 'root' (no edge) or we get the next node.
    const node = edgeId ? store.tree.getChildNodeByEdge(edgeId) : store.tree.rootNode;
    store.tree.setActiveLeafFromNode(node);

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
