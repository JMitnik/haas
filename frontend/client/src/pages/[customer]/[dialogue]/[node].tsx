import { Variants, motion } from 'framer-motion';
import { observer, useObserver } from 'mobx-react-lite';
import { useParams } from 'react-router-dom';
import React from 'react';
import styled from 'styled-components/macro';

import { HAASNode } from 'types/generic';
import EmptyDialogueView from 'views/NodeView/EmptyDialogueView';
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

const NodePageContainer = styled(motion.div)`
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

const NodePage = observer(() => {
  const { edgeId, nodeId } = useParams<{ edgeId?: string, leafId?: string, nodeId?: string }>();
  const store = useDialogueTree();

  if (!edgeId && nodeId) {
    store.session.setIsAtLeaf(true);
  } else {
    store.session.setIsAtLeaf(false);
  }

  return useObserver(() => {
    // If rootNode is unknown yet, return Loader
    if (!store.tree) {
      return <Loader />;
    }

    // TODO: Disable going back

    // Either we start from the 'root' (no edge) or we get the next node.
    let node = store.tree.rootNode;

    if (edgeId) {
      node = store.tree.getChildNodeByEdge(edgeId) || store.tree.rootNode;
    } else if (!edgeId && nodeId) {
      node = store.tree.getNodeById(nodeId) || store.tree.rootNode;
    } else {
      node = store.tree.rootNode;
    }

    if (!node) {
      return <EmptyDialogueView />;
    }

    store.tree.setActiveLeafFromNode(node);

    return (
      <NodePageContainer
        variants={nodeViewAnimation}
        initial="initial"
        animate="animate"
        exit="exit"
        key={edgeId}
      >
        <NodeView node={node} />
      </NodePageContainer>
    );
  });
});

export default NodePage;
