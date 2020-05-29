import { useParams } from 'react-router-dom';
import React from 'react';

import { HAASNode } from 'types/generic';
import { motion } from 'framer-motion';
import Loader from 'components/Loader';
import NodeView from 'views/NodeView';
import useDialogueTree from 'providers/DialogueTreeProvider';

export interface GenericNodeProps {
  isLeaf?: boolean;
  node: HAASNode;
}

const NodePage = () => {
  const { edgeId, leafId } = useParams<{ edgeId?: string, leafId?: string }>();
  const { treeDispatch: { getActiveNode, getActiveLeaf } } = useDialogueTree();

  let activeNode = null;
  activeNode = getActiveNode(edgeId);
  if (leafId) activeNode = getActiveLeaf(leafId);

  if (!activeNode) return <Loader />;

  return <NodeView node={activeNode} />;
};

export default NodePage;
