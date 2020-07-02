import { Redirect, useParams } from 'react-router-dom';
import { Variants, motion, usePresence } from 'framer-motion';
import { observer, useObserver } from 'mobx-react-lite';
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

const NodePage = () => {
  const { edgeId, customerSlug, dialogueSlug } = useParams<{ customerSlug?: string, dialogueSlug?: string, edgeId?: string, leafId?: string }>();
  const store = useDialogueTree();

  return useObserver(() => {
    if (!store.tree) {
      return <Loader />;
    }

    const node = edgeId ? store.tree.getChildNodeByEdge(edgeId) : store.tree.rootNode;

    if (!node.isRoot && !node.isLeaf && !store.hasStarted) {
      return (
        <NodePageContainer
          variants={nodeViewAnimation}
          initial="initial"
          animate="animate"
          exit="exit"
          key={edgeId}
        >
          <Redirect to={`/${customerSlug}/${dialogueSlug}`} />
        </NodePageContainer>
      );
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
};

export default NodePage;
